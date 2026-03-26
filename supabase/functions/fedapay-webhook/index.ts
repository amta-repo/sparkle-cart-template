import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const getEnv = (name: string) => {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`${name} is not configured`);
  return v;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    console.log("FedaPay webhook received:", JSON.stringify(body));

    // FedaPay sends webhook events with entity and event fields
    const event = body?.name || body?.event;
    const transaction = body?.entity || body?.object;

    if (!transaction?.id) {
      return new Response(JSON.stringify({ received: true, note: "No transaction ID" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const transactionId = String(transaction.id);
    const status = (transaction.status || "").toLowerCase();

    // Map FedaPay status to our payment status
    let paymentStatus = "pending";
    let orderStatus = "pending";
    if (status === "approved" || status === "transferred") {
      paymentStatus = "successful";
      orderStatus = "paid";
    } else if (status === "declined" || status === "refunded" || status === "canceled") {
      paymentStatus = "failed";
      orderStatus = "cancelled";
    }

    const serviceClient = createClient(
      getEnv("SUPABASE_URL"),
      getEnv("SUPABASE_SERVICE_ROLE_KEY")
    );

    // Find order by payment_reference (which stores FedaPay transaction ID)
    const { data: order, error: findErr } = await serviceClient
      .from("orders")
      .select("id, payment_status")
      .eq("payment_reference", transactionId)
      .maybeSingle();

    if (findErr) {
      console.error("Order lookup error:", findErr.message);
      return new Response(JSON.stringify({ error: findErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!order) {
      console.log("No order found for transaction:", transactionId);
      return new Response(JSON.stringify({ received: true, note: "Order not found" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update order
    const { error: updateErr } = await serviceClient.from("orders").update({
      payment_status: paymentStatus,
      status: orderStatus,
    }).eq("id", order.id);

    if (updateErr) {
      console.error("Order update error:", updateErr.message);
      return new Response(JSON.stringify({ error: updateErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Order ${order.id} updated: payment_status=${paymentStatus}, status=${orderStatus}`);

    return new Response(JSON.stringify({ received: true, orderId: order.id, paymentStatus }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
