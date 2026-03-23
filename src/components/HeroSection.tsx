import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import { storeName } from "@/data/catalog";

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden hero-gradient">
      <div className="absolute inset-0 z-0">
        <img src={heroBanner} alt="XTenova Market hero banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Power Your Life with
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{storeName}</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Shop smartphones, smart tech, and solar essentials curated for everyday customers across Benin.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/products">
              <Button size="lg" className="btn-gradient text-lg px-8 py-6 min-w-[200px]">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link to="/category/smart-tech">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 min-w-[200px] bg-white/10 border-white/30 text-white hover:bg-white/20">
                View Smart Tech
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2 text-white/80"><span className="text-2xl">🚚</span><span className="text-sm">Fast Delivery</span></div>
            <div className="flex items-center gap-2 text-white/80"><span className="text-2xl">📱</span><span className="text-sm">MTN MoMo Ready</span></div>
            <div className="flex items-center gap-2 text-white/80"><span className="text-2xl">🔒</span><span className="text-sm">Secure Checkout</span></div>
            <div className="flex items-center gap-2 text-white/80"><span className="text-2xl">☀️</span><span className="text-sm">Solar & Tech Deals</span></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
