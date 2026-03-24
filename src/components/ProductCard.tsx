import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { formatPrice } from "@/lib/currency";
import { useLanguage } from "@/i18n/LanguageContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isOnSale?: boolean;
  stockLevel?: "high" | "medium" | "low" | "out";
  stockCount?: number;
}

const ProductCard = ({ id, name, price, originalPrice, image, rating, reviewCount, isNew, isOnSale, stockLevel = "high", stockCount }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();
  const isInStock = stockLevel !== "out";
  const isLowStock = stockLevel === "low" || stockLevel === "medium";
  const wishlisted = isInWishlist(id);

  const handleWishlist = () => {
    if (wishlisted) removeFromWishlist(id);
    else addToWishlist({ id, name, image, price });
  };

  return (
    <Card className="product-card group overflow-hidden">
      <div className="relative overflow-hidden">
        <img src={image} alt={name} className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" width={1024} height={768} />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && <Badge className="badge-new text-[10px] sm:text-xs">{t("product.new")}</Badge>}
          {isOnSale && <Badge className="badge-sale text-[10px] sm:text-xs">{t("product.sale")}</Badge>}
          {isLowStock && stockCount && <Badge className="badge-low-stock text-[10px] sm:text-xs">{t("product.only_left", { count: stockCount })}</Badge>}
        </div>
        <Button variant="ghost" size="icon" className={`absolute top-2 right-2 bg-background/80 hover:bg-background h-7 w-7 sm:h-9 sm:w-9 ${wishlisted ? "text-destructive" : ""}`} onClick={handleWishlist}>
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${wishlisted ? "fill-current" : ""}`} />
        </Button>
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <Button className="w-full btn-gradient text-sm" disabled={!isInStock} onClick={() => addToCart({ id, name, image, price })}>
            {isInStock ? t("product.add_to_cart") : t("product.out_of_stock")}
          </Button>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(rating) ? "fill-rating-star text-rating-star" : "text-muted-foreground"}`} />)}</div>
          <span className="text-[10px] sm:text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        <h3 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">{name}</h3>
        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
          <span className="font-bold text-sm sm:text-lg text-price">{formatPrice(price)}</span>
          {originalPrice && <span className="price-original text-[10px] sm:text-sm">{formatPrice(originalPrice)}</span>}
        </div>
        {isInStock ? isLowStock ? <div className="text-[10px] sm:text-xs text-warning">{t("product.low_stock")}</div> : <div className="text-[10px] sm:text-xs text-success">{t("product.in_stock")}</div> : <div className="text-[10px] sm:text-xs text-destructive">{t("product.no_stock")}</div>}
        <Button className="w-full btn-gradient text-xs mt-2 sm:hidden" size="sm" disabled={!isInStock} onClick={() => addToCart({ id, name, image, price })}>
          {isInStock ? t("product.add_to_cart") : t("product.out_of_stock")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
