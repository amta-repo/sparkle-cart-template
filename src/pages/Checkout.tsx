import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle, Clock3, RefreshCcw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface PaymentState { orderId: string; paymentReference: string; paymentStatus: string; total: number; currency: string; }

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState | null>(null);
  const [form, setForm] = useState({ name: "", address: "", city: "", zip: "", country: STORE_COUNTRY, phone: "", paymentMethod: "mtn_momo" });

  if (!user) return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-12 sm:py-16 text-center"><h1 className="text-xl sm:text-2xl font-bold mb-4">{t("checkout.sign_in")}</h1><Link to="/auth"><Button className="btn-gradient">{t("header.sign_in")}</Button></Link></main><Footer /></div>;
  if (items.length === 0 && !paymentState) return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-12 sm:py-16 text-center"><h1 className="text-xl sm:text-2xl font-bold mb-4">{t("checkout.empty")}</h1><Link to="/products"><Button className="btn-gradient">{t("common.shop_now")}</Button></Link></main><Footer /></div>;

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = totalPrice + shipping;

  const handlePlaceOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("mtn-momo-checkout", { body: { action: "initiate", shippingName: form.name, shippingAddress: form.address, shippingCity: form.city, shippingZip: form.zip, shippingCountry: form.country, payerPhone: form.phone, paymentCurrency: STORE_CURRENCY } });
    if (error || !data) {
      toast({ title: "Payment start failed", description: error?.message || "Unable to start MTN MoMo payment.", variant: "destructive" });
      setLoading(false);
      return;
    }
    await clearCart();
    setPaymentState(data);
    toast({ title: "Payment initiated", description: "Approve the request in your MTN Mobile Money app or phone prompt." });
    setLoading(false);
  };

  const handleRefreshStatus = async () => {
    if (!paymentState) return;
    setStatusLoading(true);
    const { data, error } = await supabase.functions.invoke("mtn-momo-checkout", { body: { action: "status", orderId: paymentState.orderId } });
    if (error || !data) {
      toast({ title: "Status check failed", description: error?.message || "Unable to check payment status right now.", variant: "destructive" });
      setStatusLoading(false);
      return;
    }
    setPaymentState((current) => (current ? { ...current, ...data } : current));
    toast({ title: "Payment status updated", description: `Current status: ${String(data.paymentStatus).split("_").join(" ")}` });
    setStatusLoading(false);
  };

  const update = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  if (paymentState) {
    const isSuccess = paymentState.paymentStatus === "successful";
    const isFailed = paymentState.paymentStatus === "failed";
    return (
      <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-12 sm:py-16"><div className="max-w-2xl mx-auto rounded-3xl border bg-card p-6 sm:p-8 text-center space-y-5 sm:space-y-6">
        {isSuccess ? <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-success" /> : isFailed ? <AlertCircle className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-destructive" /> : <Clock3 className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-primary" />}
        <div><h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">{isSuccess ? t("checkout.confirmed") : isFailed ? t("checkout.failed") : t("checkout.pending")}</h1><p className="text-muted-foreground text-sm sm:text-base">{isSuccess ? t("checkout.confirmed_sub") : isFailed ? t("checkout.failed_sub") : t("checkout.pending_sub")}</p></div>
        <div className="rounded-2xl bg-secondary/40 p-4 sm:p-5 text-left space-y-2 text-sm">
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">{t("checkout.order_total")}</span><span className="font-semibold">{formatPrice(paymentState.total)}</span></div>
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">{t("checkout.currency")}</span><span className="font-semibold">{paymentState.currency}</span></div>
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">{t("checkout.reference")}</span><span className="font-semibold break-all text-right">{paymentState.paymentReference}</span></div>
          <div className="flex justify-between gap-4"><span className="text-muted-foreground">{t("checkout.status")}</span><span className="font-semibold capitalize">{paymentState.paymentStatus.split("_").join(" ")}</span></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">{!isSuccess && <Button onClick={handleRefreshStatus} disabled={statusLoading} className="btn-gradient"><RefreshCcw className="mr-2 h-4 w-4" />{statusLoading ? t("checkout.checking") : t("checkout.check_status")}</Button>}<Link to="/products"><Button variant="outline">{t("checkout.continue_shopping")}</Button></Link></div>
      </div></main><Footer /></div>
    );
  }

  return (
    <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-6 sm:py-8"><h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{t("checkout.title")}</h1><div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"><form onSubmit={handlePlaceOrder} className="space-y-6"><div className="bg-card rounded-lg border p-5 sm:p-6"><h2 className="text-lg sm:text-xl font-bold mb-4">{t("checkout.shipping_info")}</h2><div className="space-y-4"><div><Label htmlFor="name">{t("checkout.full_name")}</Label><Input id="name" value={form.name} onChange={update("name")} required /></div><div><Label htmlFor="address">{t("checkout.address")}</Label><Input id="address" value={form.address} onChange={update("address")} required /></div><div className="grid grid-cols-2 gap-4"><div><Label htmlFor="city">{t("checkout.city")}</Label><Input id="city" value={form.city} onChange={update("city")} required /></div><div><Label htmlFor="zip">{t("checkout.zip")}</Label><Input id="zip" value={form.zip} onChange={update("zip")} required /></div></div><div><Label htmlFor="phone">{t("checkout.phone")}</Label><Input id="phone" value={form.phone} onChange={update("phone")} placeholder="229xxxxxxxx" required /></div></div></div><div className="bg-card rounded-lg border p-5 sm:p-6 space-y-4"><div><h2 className="text-lg sm:text-xl font-bold">{t("checkout.payment_method")}</h2><p className="text-xs sm:text-sm text-muted-foreground mt-1">{t("checkout.momo_active")}</p></div><div><Label>{t("checkout.choose_method")}</Label><Select value={form.paymentMethod} onValueChange={(value) => setForm((prev) => ({ ...prev, paymentMethod: value }))}><SelectTrigger><SelectValue placeholder={t("checkout.choose_method")} /></SelectTrigger><SelectContent><SelectItem value="mtn_momo">MTN Mobile Money</SelectItem></SelectContent></Select></div><div className="rounded-2xl border bg-secondary/30 p-4 flex flex-wrap items-center gap-3"><div className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs sm:text-sm font-medium text-primary-foreground"><Smartphone className="mr-2 h-4 w-4" />MTN MoMo</div><img src={visaLogo} alt="Visa" className="h-6 sm:h-7 w-auto rounded bg-white px-1 py-0.5" loading="lazy" /><img src={mastercardLogo} alt="Mastercard" className="h-6 sm:h-7 w-auto rounded bg-white px-1 py-0.5" loading="lazy" /><span className="text-xs sm:text-sm text-muted-foreground">{t("checkout.card_next")}</span></div></div><Button type="submit" className="w-full btn-gradient text-base sm:text-lg py-5 sm:py-6" disabled={loading}>{loading ? t("checkout.loading") : t("checkout.pay_btn", { amount: formatPrice(total) })}</Button></form><div className="bg-card rounded-lg border p-5 sm:p-6 h-fit sticky top-24"><h2 className="text-lg sm:text-xl font-bold mb-4">{t("cart.order_summary")}</h2><div className="space-y-3">{items.map((item) => <div key={item.id} className="flex gap-3"><img src={item.product_image} alt={item.product_name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded" loading="lazy" /><div className="flex-1 min-w-0"><p className="text-xs sm:text-sm font-medium truncate">{item.product_name}</p><p className="text-xs sm:text-sm text-muted-foreground">Qty: {item.quantity}</p></div><p className="font-medium text-sm">{formatPrice(item.product_price * item.quantity)}</p></div>)}</div><Separator className="my-4" /><div className="space-y-2 text-sm"><div className="flex justify-between"><span>{t("cart.subtotal")}</span><span>{formatPrice(totalPrice)}</span></div><div className="flex justify-between"><span>{t("cart.shipping")}</span><span>{shipping === 0 ? t("cart.free") : formatPrice(shipping)}</span></div>{shipping > 0 && <p className="text-xs text-muted-foreground">{t("cart.free_over", { threshold: formatPrice(FREE_SHIPPING_THRESHOLD) })}</p>}</div><Separator className="my-4" /><div className="flex justify-between font-bold text-base sm:text-lg"><span>{t("cart.total")}</span><span>{formatPrice(total)}</span></div><p className="text-xs text-muted-foreground mt-4">{t("checkout.currency")}: {STORE_CURRENCY} · xtenovamart.com</p></div></div></main><Footer /></div>
  );
};

export default Checkout;
