import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import visaLogo from "@/assets/logos/visa-logo.png";
import mastercardLogo from "@/assets/logos/mastercard-logo.png";
import { formatPrice, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, STORE_COUNTRY, STORE_CURRENCY } from "@/lib/currency";
import { useLanguage } from "@/i18n/LanguageContext";
import { openKkiapayWidget, addKkiapayListener, removeKkiapayListener } from "kkiapay";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", address: "", city: "", zip: "",
    country: STORE_COUNTRY, phone: "", email: "",
  });

  if (!user) return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{t("checkout.sign_in")}</h1>
        <Link to="/auth"><Button className="btn-gradient">{t("header.sign_in")}</Button></Link>
      </main><Footer />
    </div>
  );

  if (items.length === 0) return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container mx-auto px-4 py-12 sm:py-16 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{t("checkout.empty")}</h1>
        <Link to="/products"><Button className="btn-gradient">{t("common.shop_now")}</Button></Link>
      </main><Footer />
    </div>
  );

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = totalPrice + shipping;

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePlaceOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.address || !form.city || !form.zip) {
      toast({ title: t("checkout.payment_error_title"), description: "Please fill all shipping fields.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      // 1. Create order in DB
      const { data: order, error: orderError } = await supabase.from("orders").insert({
        user_id: user.id,
        total,
        shipping_name: form.name,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_zip: form.zip,
        shipping_country: form.country,
        payment_method: "kkiapay",
        payment_status: "pending",
        payment_currency: STORE_CURRENCY,
        payer_phone: form.phone || null,
      }).select().single();

      if (orderError || !order) throw new Error(orderError?.message || "Failed to create order");

      // 2. Insert order items
      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        product_name: i.product_name,
        product_image: i.product_image,
        price: i.product_price,
        quantity: i.quantity,
      }));
      await supabase.from("order_items").insert(orderItems);

      // 3. Open Kkiapay widget
      const onSuccess = async (data: any) => {
        try {
          // Update order with payment reference and mark paid
          await supabase.from("orders").update({
            payment_status: "successful",
            status: "paid",
            payment_reference: data?.transactionId || String(data?.transactionId ?? ""),
          }).eq("id", order.id);

          await clearCart();
          window.removeKkiapayListener("success", onSuccess);
          window.removeKkiapayListener("failed", onFailed);
          navigate("/success");
        } catch (err) {
          console.error("Post-payment update failed:", err);
          navigate("/success");
        }
      };

      const onFailed = () => {
        toast({
          title: t("checkout.payment_cancelled_title"),
          description: t("checkout.payment_cancelled_desc"),
          variant: "destructive",
        });
        window.removeKkiapayListener("success", onSuccess);
        window.removeKkiapayListener("failed", onFailed);
        setLoading(false);
      };

      window.addKkiapayListener("success", onSuccess);
      window.addKkiapayListener("failed", onFailed);

      window.openKkiapayWidget({
        amount: total,
        position: "center",
        callback: "",
        data: "",
        theme: "#F5520F",
        key: import.meta.env.VITE_KKIAPAY_PUBLIC_KEY,
        sandbox: true,
      });

    } catch (err) {
      toast({
        title: t("checkout.payment_error_title"),
        description: err instanceof Error ? err.message : t("checkout.payment_error_desc"),
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{t("checkout.title")}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

          {/* Shipping & Payment Form */}
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="bg-card rounded-lg border p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4">{t("checkout.shipping_info")}</h2>
              <div className="space-y-4">
                <div><Label htmlFor="name">{t("checkout.full_name")}</Label><Input id="name" value={form.name} onChange={update("name")} required /></div>
                <div><Label htmlFor="email">{t("auth.email")}</Label><Input id="email" type="email" value={form.email} onChange={update("email")} placeholder={user.email || ""} /></div>
                <div><Label htmlFor="address">{t("checkout.address")}</Label><Input id="address" value={form.address} onChange={update("address")} required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label htmlFor="city">{t("checkout.city")}</Label><Input id="city" value={form.city} onChange={update("city")} required /></div>
                  <div><Label htmlFor="zip">{t("checkout.zip")}</Label><Input id="zip" value={form.zip} onChange={update("zip")} required /></div>
                </div>
                <div><Label htmlFor="phone">{t("checkout.phone")}</Label><Input id="phone" value={form.phone} onChange={update("phone")} placeholder="229xxxxxxxx" /></div>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-5 sm:p-6 space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">{t("checkout.payment_method")}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("checkout.kkiapay_desc")}</p>
              </div>
              <div className="rounded-2xl border bg-secondary/30 p-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs sm:text-sm font-medium text-primary-foreground">
                  <CreditCard className="mr-2 h-4 w-4" />Kkiapay
                </div>
                <span className="text-xs text-muted-foreground">MTN MoMo</span>
                <span className="text-xs text-muted-foreground">Moov Money</span>
                <img src={visaLogo} alt="Visa" className="h-6 sm:h-7 w-auto rounded bg-white px-1 py-0.5" loading="lazy" />
                <img src={mastercardLogo} alt="Mastercard" className="h-6 sm:h-7 w-auto rounded bg-white px-1 py-0.5" loading="lazy" />
              </div>
            </div>

            <Button type="submit" className="w-full btn-gradient text-base sm:text-lg py-5 sm:py-6" disabled={loading}>
              {loading ? t("checkout.loading") : t("checkout.pay_btn", { amount: formatPrice(total) })}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="bg-card rounded-lg border p-5 sm:p-6 h-fit sticky top-24">
            <h2 className="text-lg sm:text-xl font-bold mb-4">{t("cart.order_summary")}</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.product_image} alt={item.product_name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{item.product_name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">{formatPrice(item.product_price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>{t("cart.subtotal")}</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between"><span>{t("cart.shipping")}</span><span>{shipping === 0 ? t("cart.free") : formatPrice(shipping)}</span></div>
              {shipping > 0 && <p className="text-xs text-muted-foreground">{t("cart.free_over", { threshold: formatPrice(FREE_SHIPPING_THRESHOLD) })}</p>}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-base sm:text-lg">
              <span>{t("cart.total")}</span><span>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{t("checkout.currency")}: {STORE_CURRENCY} · xtenovamart.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
