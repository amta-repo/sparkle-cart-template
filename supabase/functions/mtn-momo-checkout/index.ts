import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MTN_BASE_URL = "https://sandbox.momodeveloper.mtn.com";
const FREE_SHIPPING_THRESHOLD = 30000;
const STANDARD_SHIPPING_FEE = 2500;

const initiateSchema = z.object({
  action: z.literal("initiate"),
  shippingName: z.string().trim().min(2).max(120),
  shippingAddress: z.string().trim().min(4).max(200),
  shippingCity: z.string().trim().min(2).max(100),
  shippingZip: z.string().trim().min(2).max(20),
  shippingCountry: z.string().trim().min(2).max(100),
  payerPhone: z.string().trim().min(8).max(20),
  paymentCurrency: z.string().trim().length(3),
});

const statusSchema = z.object({ action: z.literal("status"), orderId: z.string().uuid() });
const getEnv = (name: string) => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured`);
  return value;
};
const sanitizePhone = (value: string) => value.replace(/[^\d]/g, "");
const mapPaymentStatus = (status?: string) => {
  const normalized = (status || "").toUpperCase();
  if (["SUCCESSFUL", "SUCCESSFUL_PAYMENT", "COMPLETED"].includes(normalized)) return "successful";
  if (["FAILED", "REJECTED", "TIMEOUT", "EXPIRED"].includes(normalized)) return "failed";
  return "pending";
};
const getAnonKey = () => {
  return Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || (() => { throw new Error("No anon/publishable key configured"); })();
};
const createClients = (authHeader: string) => {
  const authClient = createClient(getEnv("SUPABASE_URL"), getAnonKey(), { global: { headers: { Authorization: authHeader } } });
  const serviceClient = createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"));
  return { authClient, serviceClient };
};
const getMtnAccessToken = async () => {
  const response = await fetch(`${MTN_BASE_URL}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${getEnv("MTN_USER_ID")}:${getEnv("MTN_API_KEY")}`)}`,
      "Ocp-Apim-Subscription-Key": getEnv("MTN_SUBSCRIPTION_KEY"),
    },
  });
  const payload = await response.text();
  if (!response.ok) throw new Error(`MTN token request failed [${response.status}]: ${payload}`);
  const parsed = JSON.parse(payload);
  if (!parsed.access_token) throw new Error("MTN token response did not include an access token");
  return parsed.access_token as string;
};
const SANDBOX_CURRENCY = "EUR";
const requestToPay = async (referenceId: string, token: string, amount: number, _currency: string, phone: string, externalId: string) => {
  const response = await fetch(`${MTN_BASE_URL}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Reference-Id": referenceId,
      "X-Target-Environment": "sandbox",
      "Ocp-Apim-Subscription-Key": getEnv("MTN_SUBSCRIPTION_KEY"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount.toFixed(0),
      currency: SANDBOX_CURRENCY,
      externalId,
      payer: { partyIdType: "MSISDN", partyId: phone },
      payerMessage: "Xtenova Mart order payment",
      payeeNote: "Order payment",
    }),
  });
  const responseText = await response.text();
  if (!response.ok) throw new Error(`MTN requestToPay failed [${response.status}]: ${responseText}`);
};
const getPaymentStatus = async (referenceId: string, token: string) => {
  const response = await fetch(`${MTN_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Target-Environment": "sandbox",
      "Ocp-Apim-Subscription-Key": getEnv("MTN_SUBSCRIPTION_KEY"),
    },
  });
  const responseText = await response.text();
  if (!response.ok) throw new Error(`MTN payment status failed [${response.status}]: ${responseText}`);
  return JSON.parse(responseText);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Missing authorization header" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { authClient, serviceClient } = createClients(authHeader);
    const { data: authData, error: authError } = await authClient.auth.getUser();
    if (authError || !authData.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const body = await req.json();

    if (body.action === "initiate") {
      const parsed = initiateSchema.safeParse(body);
      if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const cleanPhone = sanitizePhone(parsed.data.payerPhone);
      const { data: cartItems, error: cartError } = await serviceClient.from("cart_items").select("*").eq("user_id", authData.user.id).order("created_at", { ascending: true });
      if (cartError) throw new Error(`Failed to load cart items: ${cartError.message}`);
      if (!cartItems || cartItems.length === 0) return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const subtotal = cartItems.reduce((sum, item) => sum + Number(item.product_price) * item.quantity, 0);
      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
      const total = subtotal + shipping;
      const paymentReference = crypto.randomUUID();
      const { data: order, error: orderError } = await serviceClient.from("orders").insert({
        user_id: authData.user.id,
        total,
        shipping_name: parsed.data.shippingName,
        shipping_address: parsed.data.shippingAddress,
        shipping_city: parsed.data.shippingCity,
        shipping_zip: parsed.data.shippingZip,
        shipping_country: parsed.data.shippingCountry,
        payment_method: "mtn_momo",
        payment_status: "initiated",
        payment_reference: paymentReference,
        payer_phone: cleanPhone,
        payment_currency: parsed.data.paymentCurrency.toUpperCase(),
      }).select().single();
      if (orderError || !order) throw new Error(orderError?.message || "Failed to create order");
      const orderItems = cartItems.map((item) => ({ order_id: order.id, product_id: item.product_id, product_name: item.product_name, product_image: item.product_image, price: item.product_price, quantity: item.quantity }));
      const { error: orderItemsError } = await serviceClient.from("order_items").insert(orderItems);
      if (orderItemsError) throw new Error(`Failed to create order items: ${orderItemsError.message}`);
      try {
        const token = await getMtnAccessToken();
        await requestToPay(paymentReference, token, total, parsed.data.paymentCurrency.toUpperCase(), cleanPhone, order.id);
      } catch (paymentError) {
        await serviceClient.from("orders").update({ payment_status: "failed" }).eq("id", order.id);
        throw paymentError;
      }
      await serviceClient.from("orders").update({ payment_status: "pending" }).eq("id", order.id);
      await serviceClient.from("cart_items").delete().eq("user_id", authData.user.id);
      return new Response(JSON.stringify({ orderId: order.id, paymentReference, paymentStatus: "pending", total, currency: parsed.data.paymentCurrency.toUpperCase() }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: order, error: orderError } = await serviceClient.from("orders").select("id, payment_reference, total, payment_currency").eq("id", parsed.data.orderId).eq("user_id", authData.user.id).single();
    if (orderError || !order) return new Response(JSON.stringify({ error: "Order not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!order.payment_reference) return new Response(JSON.stringify({ error: "Order has no MTN reference" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const token = await getMtnAccessToken();
    const paymentDetails = await getPaymentStatus(order.payment_reference, token);
    const nextStatus = mapPaymentStatus(paymentDetails.status);
    await serviceClient.from("orders").update({ payment_status: nextStatus }).eq("id", order.id);
    return new Response(JSON.stringify({ orderId: order.id, paymentReference: order.payment_reference, paymentStatus: nextStatus, total: Number(order.total), currency: order.payment_currency, providerStatus: paymentDetails.status }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
