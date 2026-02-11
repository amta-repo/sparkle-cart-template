import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { CheckCircle } from "lucide-react";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({
    name: "", address: "", city: "", zip: "", country: "US",
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to checkout</h1>
          <Link to="/auth"><Button className="btn-gradient">Sign In</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <CheckCircle className="h-20 w-20 mx-auto text-success mb-6" />
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-8">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
          <Link to="/products"><Button className="btn-gradient">Continue Shopping</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/products"><Button className="btn-gradient">Shop Now</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const total = totalPrice + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        shipping_name: form.name,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_zip: form.zip,
        shipping_country: form.country,
      })
      .select()
      .single();

    if (orderError || !order) {
      toast({ title: "Error", description: "Failed to place order.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      price: item.product_price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      toast({ title: "Error", description: "Failed to save order items.", variant: "destructive" });
      setLoading(false);
      return;
    }

    await clearCart();
    setOrderPlaced(true);
    setLoading(false);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" value={form.name} onChange={update("name")} required /></div>
                <div><Label htmlFor="address">Address</Label><Input id="address" value={form.address} onChange={update("address")} required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label htmlFor="city">City</Label><Input id="city" value={form.city} onChange={update("city")} required /></div>
                  <div><Label htmlFor="zip">ZIP Code</Label><Input id="zip" value={form.zip} onChange={update("zip")} required /></div>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full btn-gradient text-lg py-6" disabled={loading}>
              {loading ? "Processing..." : `Place Order — $${total.toFixed(2)}`}
            </Button>
          </form>

          <div className="bg-card rounded-lg border p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.product_image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.product_price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
