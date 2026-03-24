import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categoryCards } from "@/data/catalog";
import { useLanguage } from "@/i18n/LanguageContext";

const CategorySection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t("categories.title")}</h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">{t("categories.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categoryCards.map((category) => (
            <Card key={category.id} className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${category.featured ? "md:col-span-2 lg:col-span-1" : ""}`}>
              <Link to={category.href}>
                <div className="relative overflow-hidden">
                  <img src={category.image} alt={t(category.nameKey)} className="w-full h-52 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" width={1024} height={768} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                    <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">{t(category.nameKey)}</h3>
                    <p className="text-white/90 text-sm sm:text-base mb-3 sm:mb-4">{t(category.descKey)}</p>
                    <Button variant="secondary" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm text-sm">{t("categories.shop_now")}<ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t">
          {[
            { value: "15+", label: t("categories.live_products") },
            { value: "3", label: t("categories.core_categories") },
            { value: "24h", label: t("categories.order_review") },
            { value: "MTN", label: t("categories.momo_checkout") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
              <div className="text-xs sm:text-base text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
