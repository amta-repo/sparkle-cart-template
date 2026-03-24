import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { bestSellers, featuredProducts } from "@/data/catalog";
import { useLanguage } from "@/i18n/LanguageContext";

const FeaturedProducts = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{t("featured.title")}</h2>
              <p className="text-muted-foreground text-sm sm:text-base">{t("featured.subtitle")}</p>
            </div>
            <Link to="/products"><Button variant="outline" className="mt-4 md:mt-0">{t("featured.view_all")}<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-6">
            {featuredProducts.map((product) => <ProductCard key={product.id} {...product} />)}
          </div>
        </div>

        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{t("featured.best_sellers")}</h2>
              <p className="text-muted-foreground text-sm sm:text-base">{t("featured.best_sellers_sub")}</p>
            </div>
            <Link to="/products"><Button variant="outline" className="mt-4 md:mt-0">{t("featured.view_all_best")}<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((product) => <ProductCard key={product.id} {...product} />)}
          </div>
        </div>

        <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-muted rounded-2xl text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t("featured.trusted")}</h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">{t("featured.testimonial")}</p>
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">{[...Array(5)].map((_, i) => <span key={i} className="text-rating-star text-lg sm:text-xl">★</span>)}<span className="ml-2 font-semibold">4.8/5</span></div>
            <p className="text-xs sm:text-sm text-muted-foreground">{t("featured.based_on")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
