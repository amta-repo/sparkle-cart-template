import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  product_price: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  addToWishlist: (product: { id: string; name: string; image: string; price: number }) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToWishlist = async (product: { id: string; name: string; image: string; price: number }) => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to add to wishlist.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("wishlist_items").insert({
      user_id: user.id,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      product_price: product.price,
    });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already in wishlist", description: `${product.name} is already in your wishlist.` });
      } else {
        toast({ title: "Error", description: "Failed to add to wishlist.", variant: "destructive" });
      }
    } else {
      toast({ title: "Added to wishlist", description: `${product.name} added to your wishlist.` });
      fetchWishlist();
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    await supabase.from("wishlist_items").delete().eq("product_id", productId).eq("user_id", user.id);
    toast({ title: "Removed from wishlist" });
    fetchWishlist();
  };

  const isInWishlist = (productId: string) => items.some(i => i.product_id === productId);
  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{ items, loading, addToWishlist, removeFromWishlist, isInWishlist, totalItems }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
