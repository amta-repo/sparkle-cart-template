import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Truck, Shield, RotateCcw } from "lucide-react";
import visaLogo from "@/assets/logos/visa-logo.png";
import mastercardLogo from "@/assets/logos/mastercard-logo.png";
import amexLogo from "@/assets/logos/amex-logo.png";
import paypalLogo from "@/assets/logos/paypal-logo.png";
import { Link } from "react-router-dom";
import { categoryCards, storeEmail, storeLocation, storeName, storePhone } from "@/data/catalog";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/currency";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay in the Loop</h3>
            <p className="text-primary-foreground/90 mb-6">Get exclusive deals, new arrivals, and product restock alerts from XTenova Market.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="bg-white text-foreground border-0" />
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">X</span>
              </div>
              <span className="text-xl font-bold">{storeName}</span>
            </div>
            <p className="text-muted-foreground mb-4">Reliable gadgets, solar essentials, and mobile accessories for shoppers across Benin.</p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon"><Facebook className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Instagram className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Twitter className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Youtube className="h-5 w-5" /></Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: "All Products", href: "/products" },
                { label: "Checkout", href: "/checkout" },
                { label: "My Cart", href: "/cart" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Sign In", href: "/auth" },
              ].map((link) => (
                <Link key={link.label} to={link.href} className="block text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <div className="space-y-2">
              {[...categoryCards, { id: "sale", name: "Sale Items", href: "/sale" }].map((category) => (
                <Link key={category.id} to={category.href} className="block text-muted-foreground hover:text-primary transition-colors">{category.name}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3"><MapPin className="h-5 w-5 text-muted-foreground" /><span className="text-muted-foreground">{storeLocation}</span></div>
              <div className="flex items-center space-x-3"><Phone className="h-5 w-5 text-muted-foreground" /><span className="text-muted-foreground">{storePhone}</span></div>
              <div className="flex items-center space-x-3"><Mail className="h-5 w-5 text-muted-foreground" /><span className="text-muted-foreground">{storeEmail}</span></div>
            </div>

            <div className="mt-6">
              <h5 className="font-medium mb-3">Why Choose Us?</h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground"><Truck className="h-4 w-4" /><span>Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span></div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground"><RotateCcw className="h-4 w-4" /><span>Order support after checkout</span></div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground"><Shield className="h-4 w-4" /><span>Secure payment</span></div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground"><CreditCard className="h-4 w-4" /><span>MTN MoMo live, cards coming next</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-muted-foreground">© {currentYear} {storeName}. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Cookie Policy</a>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">We accept:</span>
            <div className="flex items-center space-x-3">
              <img src={visaLogo} alt="Visa" className="h-6 w-auto bg-white rounded px-1" />
              <img src={mastercardLogo} alt="Mastercard" className="h-6 w-auto bg-white rounded px-1" />
              <img src={amexLogo} alt="American Express" className="h-6 w-auto bg-white rounded px-1" />
              <img src={paypalLogo} alt="PayPal" className="h-6 w-auto bg-white rounded px-1" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
