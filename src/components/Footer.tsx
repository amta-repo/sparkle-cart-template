import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Truck, Shield, RotateCcw } from "lucide-react";
import visaLogo from "@/assets/logos/visa-logo.png";
import mastercardLogo from "@/assets/logos/mastercard-logo.png";
import amexLogo from "@/assets/logos/amex-logo.png";
import paypalLogo from "@/assets/logos/paypal-logo.png";
import xtenovaLogo from "@/assets/logos/xtenova-logo.png";
import { Link } from "react-router-dom";
import { categoryCards, storeEmail, storeLocation, storeName, storePhone } from "@/data/catalog";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/currency";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t">
      <div className="bg-primary text-primary-foreground py-10 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">{t("footer.stay_loop")}</h3>
            <p className="text-primary-foreground/90 text-sm sm:text-base mb-5 sm:mb-6">{t("footer.stay_loop_sub")}</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input type="email" placeholder={t("footer.enter_email")} className="bg-white text-foreground border-0" />
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">{t("footer.subscribe")}</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={xtenovaLogo} alt="Xtenova Mart" className="w-8 h-8 rounded-full object-cover" width={32} height={32} />
              <span className="text-lg sm:text-xl font-bold">{storeName}</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{t("footer.description")}</p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon"><Facebook className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Instagram className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Twitter className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Youtube className="h-5 w-5" /></Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-4">{t("footer.quick_links")}</h4>
            <div className="space-y-2">
              {[
                { label: t("footer.all_products"), href: "/products" },
                { label: t("footer.checkout"), href: "/checkout" },
                { label: t("footer.my_cart"), href: "/cart" },
                { label: t("footer.wishlist"), href: "/wishlist" },
                { label: t("footer.sign_in"), href: "/auth" },
              ].map((link) => (
                <Link key={link.label} to={link.href} className="block text-muted-foreground hover:text-primary transition-colors text-sm">{link.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-4">{t("footer.categories")}</h4>
            <div className="space-y-2">
              {[...categoryCards.map((c) => ({ id: c.id, name: t(c.nameKey), href: c.href })), { id: "sale", name: t("footer.sale"), href: "/sale" }].map((category) => (
                <Link key={category.id} to={category.href} className="block text-muted-foreground hover:text-primary transition-colors text-sm">{category.name}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-4">{t("footer.contact")}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3"><MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" /><span className="text-muted-foreground text-sm">{storeLocation}</span></div>
              <div className="flex items-center space-x-3"><Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" /><a href={`tel:${storePhone.replace(/\s/g, "")}`} className="text-muted-foreground text-sm hover:text-primary">{storePhone}</a></div>
              <div className="flex items-center space-x-3"><Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" /><a href={`mailto:${storeEmail}`} className="text-muted-foreground text-sm hover:text-primary">{storeEmail}</a></div>
            </div>

            <div className="mt-6">
              <h5 className="font-medium mb-3 text-sm">{t("footer.why_us")}</h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground"><Truck className="h-4 w-4 flex-shrink-0" /><span>{t("footer.free_shipping", { threshold: formatPrice(FREE_SHIPPING_THRESHOLD) })}</span></div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground"><RotateCcw className="h-4 w-4 flex-shrink-0" /><span>{t("footer.order_support")}</span></div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground"><Shield className="h-4 w-4 flex-shrink-0" /><span>{t("footer.secure_payment")}</span></div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground"><CreditCard className="h-4 w-4 flex-shrink-0" /><span>{t("footer.momo_live")}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="container mx-auto px-4 py-5 sm:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-xs sm:text-sm text-muted-foreground">© {currentYear} {storeName}. {t("footer.rights")} · <a href="https://xtenovamart.com" className="hover:text-primary" rel="noopener">xtenovamart.com</a></div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <a href="https://xtenovamart.com/privacy" className="text-muted-foreground hover:text-primary">{t("footer.privacy")}</a>
            <a href="https://xtenovamart.com/terms" className="text-muted-foreground hover:text-primary">{t("footer.terms")}</a>
            <a href="https://xtenovamart.com/cookies" className="text-muted-foreground hover:text-primary">{t("footer.cookies")}</a>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="text-xs sm:text-sm text-muted-foreground">{t("footer.we_accept")}</span>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img src={visaLogo} alt="Visa" className="h-5 sm:h-6 w-auto bg-white rounded px-1" loading="lazy" />
              <img src={mastercardLogo} alt="Mastercard" className="h-5 sm:h-6 w-auto bg-white rounded px-1" loading="lazy" />
              <img src={amexLogo} alt="American Express" className="h-5 sm:h-6 w-auto bg-white rounded px-1" loading="lazy" />
              <img src={paypalLogo} alt="PayPal" className="h-5 sm:h-6 w-auto bg-white rounded px-1" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
