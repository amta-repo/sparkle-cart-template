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

interface PaymentState { orderId: string; paymentReference: string; paymentStatus: string; total: number; currency: string; }

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState | null>(null);
  const [form, setForm] = useState({ name: "", address: "", city: "", zip: "", country: STORE_COUNTRY, phone: "", paymentMethod: "mtn_momo" });
  if (!user) return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold mb-4">Please sign in to checkout</h1><Link to="/auth"><Button className="btn-gradient">Sign In</Button></Link></main><Footer /></div>;
  if (items.length === 0 && !paymentState) return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold mb-4">Your cart is empty</h1><Link to="/products"><Button className="btn-gradient">Shop Now</Button></Link></main><Footer /></div>;
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
    toast({ title: "Payment status updated", description: `Current status: ${String(data.paymentStatus).replaceAll("_", " ")}` });
    setStatusLoading(false);
  };

  const update = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => setForm((previous) => ({ ...previous, [field]: event.target.value }));

  if (paymentState) {
    const isSuccess = paymentState.paymentStatus === "successful";
    const isFailed = paymentState.paymentStatus === "failed";
    return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-16"><div className="max-w-2xl mx-auto rounded-3xl border bg-card p-8 text-center space-y-6">{isSuccess ? <CheckCircle className="h-20 w-20 mx-auto text-success" /> : isFailed ? <AlertCircle className="h-20 w-20 mx-auto text-destructive" /> : <Clock3 className="h-20 w-20 mx-auto text-primary" />}<div><h1 className="text-3xl font-bold mb-3">{isSuccess ? "Payment Confirmed" : isFailed ? "Payment Needs Attention" : "Complete Payment on Your Phone"}</h1><p className="text-muted-foreground">{isSuccess ? "Your order has been confirmed and is now being prepared." : isFailed ? "The MTN MoMo request was not completed. You can try checkout again." : "Approve the MTN Mobile Money prompt on your device, then refresh the payment status here."}</p></div><div className="rounded-2xl bg-secondary/40 p-5 text-left space-y-2"><div className="flex justify-between gap-4"><span className="text-muted-foreground">Order Total</span><span className="font-semibold">{formatPrice(paymentState.total)}</span></div><div className="flex justify-between gap-4"><span className="text-muted-foreground">Currency</span><span className="font-semibold">{paymentState.currency}</span></div><div className="flex justify-between gap-4"><span className="text-muted-foreground">Reference</span><span className="font-semibold break-all text-right">{paymentState.paymentReference}</span></div><div className="flex justify-between gap-4"><span className="text-muted-foreground">Status</span><span className="font-semibold capitalize">{paymentState.paymentStatus.replaceAll("_", " ")}</span></div></div><div className="flex flex-col sm:flex-row gap-3 justify-center">{!isSuccess && <Button onClick={handleRefreshStatus} disabled={statusLoading} className="btn-gradient"><RefreshCcw className="mr-2 h-4 w-4" />{statusLoading ? "Checking..." : "Check Payment Status"}</Button>}<Link to="/products"><Button variant="outline">Continue Shopping</Button></Link></div></div></main><Footer /></div>;
  }

  return (
    <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-8">Checkout</h1><div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><form onSubmit={handlePlaceOrder} className="space-y-6"><div className="bg-card rounded-lg border p-6"><h2 className="text-xl font-bold mb-4">Shipping Information</h2><div className="space-y-4"><div><Label htmlFor="name">Full Name</Label><Input id="name" value={form.name} onChange={update("name")} required /></div><div><Label htmlFor="address">Address</Label><Input id="address" value={form.address} onChange={update("address")} required /></div><div className="grid grid-cols-2 gap-4"><div><Label htmlFor="city">City</Label><Input id="city" value={form.city} onChange={update("city")} required /></div><div><Label htmlFor="zip">ZIP Code</Label><Input id="zip" value={form.zip} onChange={update("zip")} required /></div></div><div><Label htmlFor="phone">MTN Mobile Money Number</Label><Input id="phone" value={form.phone} onChange={update("phone")} placeholder="229xxxxxxxx" required /></div></div></div><div className="bg-card rounded-lg border p-6 space-y-4"><div><h2 className="text-xl font-bold">Payment Method</h2><p className="text-sm text-muted-foreground mt-1">MTN Mobile Money is active now. Visa and Mastercard UI is ready for the next gateway phase.</p></div><div><Label>Checkout Method</Label><Select value={form.paymentMethod} onValueChange={(value) => setForm((previous) => ({ ...previous, paymentMethod: value }))}><SelectTrigger><SelectValue placeholder="Choose payment method" /></SelectTrigger><SelectContent><SelectItem value="mtn_momo">MTN Mobile Money</SelectItem></SelectContent></Select></div><div className="rounded-2xl border bg-secondary/30 p-4 flex flex-wrap items-center gap-3"><div className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground"><Smartphone className="mr-2 h-4 w-4" />MTN MoMo</div><img src={visaLogo} alt="Visa" className="h-7 w-auto rounded bg-white px-1 py-0.5" /><img src={mastercardLogo} alt="Mastercard" className="h-7 w-auto rounded bg-white px-1 py-0.5" /><span className="text-sm text-muted-foreground">Card gateway next</span></div></div><Button type="submit" className="w-full btn-gradient text-lg py-6" disabled={loading}>{loading ? "Starting payment..." : `Pay ${formatPrice(total)} with MTN MoMo`}</Button></form><div className="bg-card rounded-lg border p-6 h-fit sticky top-24"><h2 className="text-xl font-bold mb-4">Order Summary</h2><div className="space-y-3">{items.map((item) => <div key={item.id} className="flex gap-3"><img src={item.product_image} alt={item.product_name} className="w-16 h-16 object-cover rounded" /><div className="flex-1"><p className="text-sm font-medium">{item.product_name}</p><p className="text-sm text-muted-foreground">Qty: {item.quantity}</p></div><p className="font-medium">{formatPrice(item.product_price * item.quantity)}</p></div>)}</div><Separator className="my-4" /><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div><div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>{shipping > 0 && <p className="text-xs text-muted-foreground">Free shipping when you order above {formatPrice(FREE_SHIPPING_THRESHOLD)}</p>}</div><Separator className="my-4" /><div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(total)}</span></div><p className="text-xs text-muted-foreground mt-4">Checkout country: {form.country} · Currency: {STORE_CURRENCY}</p></div></div></main><Footer /></div>
  );
};

export default Checkout;
