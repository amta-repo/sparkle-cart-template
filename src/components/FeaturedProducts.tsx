import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";

// Mock product data - in a real app, this would come from an API
const featuredProducts = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 129.99,
    originalPrice: 179.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 324,
    isOnSale: true,
    stockLevel: "high" as const,
  },
  {
    id: "2",
    name: "Premium Skincare Set",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 156,
    isNew: true,
    stockLevel: "low" as const,
    stockCount: 3,
  },
  {
    id: "3",
    name: "Designer Running Shoes",
    price: 159.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 891,
    isOnSale: true,
    stockLevel: "high" as const,
  },
  {
    id: "4",
    name: "Smart Fitness Watch",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 567,
    stockLevel: "high" as const,
  },
  {
    id: "5",
    name: "Luxury Handbag",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 234,
    isOnSale: true,
    stockLevel: "low" as const,
    stockCount: 2,
  },
  {
    id: "6",
    name: "Wireless Charging Pad",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 423,
    isNew: true,
    stockLevel: "high" as const,
  },
];

const bestSellers = [
  {
    id: "7",
    name: "Classic White Sneakers",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 1250,
    stockLevel: "high" as const,
  },
  {
    id: "8",
    name: "Moisture-Rich Face Cream",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 789,
    stockLevel: "high" as const,
  },
  {
    id: "9",
    name: "Bluetooth Speaker",
    price: 69.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 456,
    isOnSale: true,
    stockLevel: "high" as const,
  },
  {
    id: "10",
    name: "Silk Scarf Collection",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 234,
    isNew: true,
    stockLevel: "low" as const,
    stockCount: 5,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Featured Products */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked items just for you</p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Best Sellers</h2>
              <p className="text-muted-foreground">Most popular items this month</p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0">
              View All Best Sellers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 p-8 bg-muted rounded-2xl text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Join 50,000+ Happy Customers</h3>
            <p className="text-muted-foreground mb-6">
              "Amazing quality and fast shipping! I've been shopping here for over a year and never been disappointed."
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-rating-star text-xl">★</span>
              ))}
              <span className="ml-2 font-semibold">4.8/5</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on 12,450+ verified reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;