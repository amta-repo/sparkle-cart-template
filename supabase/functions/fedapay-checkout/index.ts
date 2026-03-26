import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FREE_SHIPPING_THRESHOLD = 30000;
const STANDARD_SHIPPING_FEE = 2500;

const getEnv = (name: string) => {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`${name} is not configured`);
  return v;
};

const getAnonKey = () =>
  Deno.env.get("SUPABASE_ANON_KEY") ||
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ||
  (() => { throw new Error("No anon key configured"); })();

const FEDAPAY_BASE = "https://sandbox-api.fedapay.com/v1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = getEnv("SUPABASE_URL");
    const authClient = createClient(supabaseUrl, getAnonKey(), {
      global: { headers: { Authorization: authHeader } },
    });
    const serviceClient = createClient(supabaseUrl, getEnv("SUPABASE_SERVICE_ROLE_KEY"));

    const { data: authData, error: authError } = await authClient.auth.getUser();
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      shippingName, shippingAddress, shippingCity, shippingZip,
      shippingCountry = "Benin", customerEmail, customerPhone,
    } = body;

    if (!shippingName || !shippingAddress || !shippingCity || !shippingZip) {
      return new Response(JSON.stringify({ error: "Missing shipping fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load cart
    const { data: cartItems, error: cartError } = await serviceClient
      .from("cart_items").select("*").eq("user_id", authData.user.id);
    if (cartError) throw new Error(`Cart load failed: ${cartError.message}`);
    if (!cartItems?.length) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subtotal = cartItems.reduce((s, i) => s + Number(i.product_price) * i.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const total = subtotal + shipping;

    // Create order
    const { data: order, error: orderError } = await serviceClient.from("orders").insert({
      user_id: authData.user.id,
      total,
      shipping_name: shippingName,
      shipping_address: shippingAddress,
      shipping_city: shippingCity,
      shipping_zip: shippingZip,
      shipping_country: shippingCountry,
      payment_method: "fedapay",
      payment_status: "pending",
      payment_currency: "XOF",
      payer_phone: customerPhone || null,
    }).select().single();
    if (orderError || !order) throw new Error(orderError?.message || "Failed to create order");

    // Insert order items
    const orderItems = cartItems.map((i) => ({
      order_id: order.id, product_id: i.product_id,
      product_name: i.product_name, product_image: i.product_image,
      price: i.product_price, quantity: i.quantity,
    }));
    const { error: oiErr } = await serviceClient.from("order_items").insert(orderItems);
    if (oiErr) throw new Error(`Order items failed: ${oiErr.message}`);

    // Create FedaPay transaction
    const fedapayKey = getEnv("FEDAPAY_SECRET_KEY");
    const callbackUrl = `${supabaseUrl}/functions/v1/fedapay-webhook`;

    const txRes = await fetch(`${FEDAPAY_BASE}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${fedapayKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: `Xtenova Mart - Commande #${order.id.slice(0, 8)}`,
        amount: total,
        currency: { iso: "XOF" },
        callback_url: callbackUrl,
        customer: {
          email: customerEmail || authData.user.email || "customer@xtenovamart.com",
          phone_number: customerPhone ? { number: customerPhone, country: "bj" } : undefined,
        },
      }),
    });

    const txText = await txRes.text();
    console.log("FedaPay create response:", txText);
    if (!txRes.ok) throw new Error(`FedaPay create transaction failed [${txRes.status}]: ${txText}`);
    const txData = JSON.parse(txText);
    // FedaPay returns { v1: { transaction: { id, ... } } } or directly { id, ... }
    const transactionId = txData?.v1?.transaction?.id || txData?.transaction?.id || txData?.id;
    if (!transactionId) throw new Error(`FedaPay did not return a transaction ID. Response: ${JSON.stringify(txData).slice(0, 500)}`);

    // Update order with FedaPay reference
    await serviceClient.from("orders").update({
      payment_reference: String(transactionId),
    }).eq("id", order.id);

    // Generate payment token/URL
    const tokenRes = await fetch(`${FEDAPAY_BASE}/transactions/${transactionId}/token`, {
      method: "POST",
      headers: { Authorization: `Bearer ${fedapayKey}`, "Content-Type": "application/json" },
    });
    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) throw new Error(`FedaPay token failed [${tokenRes.status}]: ${tokenText}`);
    const tokenData = JSON.parse(tokenText);
    const paymentUrl = tokenData?.token;
    if (!paymentUrl) throw new Error("FedaPay did not return a payment token/URL");

    // Clear cart
    await serviceClient.from("cart_items").delete().eq("user_id", authData.user.id);

    return new Response(JSON.stringify({
      orderId: order.id,
      paymentUrl: `https://process.fedapay.com/${paymentUrl}`,
      transactionId,
      total,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
