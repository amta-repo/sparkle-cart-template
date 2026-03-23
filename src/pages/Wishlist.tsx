import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/currency";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  if (!user) return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-16 text-center"><Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-2xl font-bold mb-4">Sign in to view your wishlist</h1><Link to="/auth"><Button className="btn-gradient">Sign In</Button></Link></main><Footer /></div>;
  if (items.length === 0) return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-16 text-center"><Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1><p className="text-muted-foreground mb-6">Save your favorite items for later.</p><Link to="/products"><Button className="btn-gradient">Browse Products</Button></Link></main><Footer /></div>;
  return (
    <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-8">My Wishlist ({items.length} items)</h1><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{items.map((item) => <div key={item.id} className="bg-card rounded-lg border overflow-hidden"><img src={item.product_image} alt={item.product_name} className="w-full h-48 object-cover" /><div className="p-4"><h3 className="font-medium text-sm mb-2">{item.product_name}</h3><p className="font-bold text-lg mb-3">{formatPrice(item.product_price)}</p><div className="flex gap-2"><Button className="flex-1 btn-gradient" size="sm" onClick={() => addToCart({ id: item.product_id, name: item.product_name, image: item.product_image, price: item.product_price })}><ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart</Button><Button variant="outline" size="icon" className="text-destructive" onClick={() => removeFromWishlist(item.product_id)}><Trash2 className="h-4 w-4" /></Button></div></div></div>)}</div></main><Footer /></div>
  );
};

export default Wishlist;
