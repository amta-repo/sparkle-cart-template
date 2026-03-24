import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/currency";
import { useLanguage } from "@/i18n/LanguageContext";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-12 sm:py-16 text-center"><ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-xl sm:text-2xl font-bold mb-4">{t("cart.sign_in_prompt")}</h1><Link to="/auth"><Button className="btn-gradient">{t("header.sign_in")}</Button></Link></main><Footer /></div>;
  if (items.length === 0) return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-12 sm:py-16 text-center"><ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-xl sm:text-2xl font-bold mb-4">{t("cart.empty")}</h1><p className="text-muted-foreground text-sm mb-6">{t("cart.empty_sub")}</p><Link to="/products"><Button className="btn-gradient">{t("common.shop_now")}</Button></Link></main><Footer /></div>;

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  return (
    <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-6 sm:py-8"><h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{t("cart.title", { count: totalItems })}</h1><div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"><div className="lg:col-span-2 space-y-3 sm:space-y-4">{items.map((item) => <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg border"><img src={item.product_image} alt={item.product_name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded" loading="lazy" /><div className="flex-1 min-w-0"><h3 className="font-medium text-sm sm:text-base truncate">{item.product_name}</h3><p className="text-base sm:text-lg font-bold mt-1">{formatPrice(item.product_price)}</p><div className="flex items-center gap-2 mt-2"><Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button><span className="w-8 text-center text-sm">{item.quantity}</span><Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 ml-auto text-destructive" onClick={() => removeFromCart(item.id)}><Trash2 className="h-4 w-4" /></Button></div></div></div>)}</div><div className="bg-card rounded-lg border p-5 sm:p-6 h-fit sticky top-24"><h2 className="text-lg sm:text-xl font-bold mb-4">{t("cart.order_summary")}</h2><div className="space-y-2 text-sm"><div className="flex justify-between"><span>{t("cart.subtotal")}</span><span>{formatPrice(totalPrice)}</span></div><div className="flex justify-between"><span>{t("cart.shipping")}</span><span>{shipping === 0 ? t("cart.free") : formatPrice(shipping)}</span></div>{shipping > 0 && <p className="text-xs text-muted-foreground">{t("cart.free_over", { threshold: formatPrice(FREE_SHIPPING_THRESHOLD) })}</p>}</div><Separator className="my-4" /><div className="flex justify-between font-bold text-base sm:text-lg"><span>{t("cart.total")}</span><span>{formatPrice(totalPrice + shipping)}</span></div><Link to="/checkout"><Button className="w-full btn-gradient mt-6">{t("cart.checkout")}</Button></Link></div></div></main><Footer /></div>
  );
};

export default Cart;
