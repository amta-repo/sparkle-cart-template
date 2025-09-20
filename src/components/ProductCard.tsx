import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  stockLevel?: "high" | "low" | "out";
  stockCount?: number;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  isNew,
  isOnSale,
  stockLevel = "high",
  stockCount,
}: ProductCardProps) => {
  const isInStock = stockLevel !== "out";
  const isLowStock = stockLevel === "low";

  return (
    <Card className="product-card group overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && <Badge className="badge-new">New</Badge>}
          {isOnSale && <Badge className="badge-sale">Sale</Badge>}
          {isLowStock && stockCount && (
            <Badge className="badge-low-stock">Only {stockCount} left!</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Quick Add to Cart (shows on hover) */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button className="w-full btn-gradient" disabled={!isInStock}>
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) 
                    ? "fill-rating-star text-rating-star" 
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg text-price">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="price-original">${originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Stock Status */}
        {isInStock ? (
          isLowStock ? (
            <div className="text-xs text-warning">⚠️ Low stock</div>
          ) : (
            <div className="text-xs text-success">✓ In stock</div>
          )
        ) : (
          <div className="text-xs text-destructive">❌ Out of stock</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;