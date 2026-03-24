import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/currency";
import { useLanguage } from "@/i18n/LanguageContext";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-12 sm:py-16 text-center"><Heart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-xl sm:text-2xl font-bold mb-4">{t("wishlist.sign_in")}</h1><Link to="/auth"><Button className="btn-gradient">{t("header.sign_in")}</Button></Link></main><Footer /></div>;
  if (items.length === 0) return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-12 sm:py-16 text-center"><Heart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-xl sm:text-2xl font-bold mb-4">{t("wishlist.empty")}</h1><p className="text-muted-foreground text-sm mb-6">{t("wishlist.empty_sub")}</p><Link to="/products"><Button className="btn-gradient">{t("wishlist.browse")}</Button></Link></main><Footer /></div>;

  return (
    <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-6 sm:py-8"><h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{t("wishlist.title", { count: items.length })}</h1><div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">{items.map((item) => <div key={item.id} className="bg-card rounded-lg border overflow-hidden"><img src={item.product_image} alt={item.product_name} className="w-full h-36 sm:h-48 object-cover" loading="lazy" /><div className="p-3 sm:p-4"><h3 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">{item.product_name}</h3><p className="font-bold text-sm sm:text-lg mb-2 sm:mb-3">{formatPrice(item.product_price)}</p><div className="flex gap-2"><Button className="flex-1 btn-gradient text-[10px] sm:text-sm" size="sm" onClick={() => addToCart({ id: item.product_id, name: item.product_name, image: item.product_image, price: item.product_price })}><ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /><span className="hidden sm:inline">{t("product.add_to_cart")}</span><span className="sm:hidden">+</span></Button><Button variant="outline" size="icon" className="text-destructive h-8 w-8" onClick={() => removeFromWishlist(item.product_id)}><Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Button></div></div></div>)}</div></main><Footer /></div>
  );
};

export default Wishlist;
