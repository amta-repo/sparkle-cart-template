import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import { storeName } from "@/data/catalog";
import { useLanguage } from "@/i18n/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative h-[70vh] sm:h-[80vh] min-h-[500px] sm:min-h-[600px] flex items-center justify-center overflow-hidden hero-gradient">
      <div className="absolute inset-0 z-0">
        <img src={heroBanner} alt="Xtenova Mart – smartphones, smart tech et produits solaires au Bénin" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            {t("hero.title_line1")}
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{storeName}</span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link to="/products">
              <Button size="lg" className="btn-gradient text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 min-w-[180px] sm:min-w-[200px]">
                {t("hero.shop_now")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link to="/category/smart-tech">
              <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 min-w-[180px] sm:min-w-[200px] bg-white/10 border-white/30 text-white hover:bg-white/20">
                {t("hero.view_smart_tech")}
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
            <div className="flex items-center gap-2 text-white/80"><span className="text-xl sm:text-2xl">🚚</span><span className="text-xs sm:text-sm">{t("hero.fast_delivery")}</span></div>
            <div className="flex items-center gap-2 text-white/80"><span className="text-xl sm:text-2xl">📱</span><span className="text-xs sm:text-sm">{t("hero.momo_ready")}</span></div>
            <div className="flex items-center gap-2 text-white/80"><span className="text-xl sm:text-2xl">🔒</span><span className="text-xs sm:text-sm">{t("hero.secure_checkout")}</span></div>
            <div className="flex items-center gap-2 text-white/80"><span className="text-xl sm:text-2xl">☀️</span><span className="text-xs sm:text-sm">{t("hero.solar_deals")}</span></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
