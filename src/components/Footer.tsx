import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      {/* Newsletter Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay in the Loop
            </h3>
            <p className="text-primary-foreground/90 mb-6">
              Get exclusive deals, style tips, and be the first to know about new arrivals
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-foreground border-0"
              />
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/80 mt-3">
              Join 25,000+ subscribers and get 10% off your first order
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">StyleStore</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Your destination for premium fashion, technology, and lifestyle products. 
              Quality guaranteed, style delivered.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                "About Us",
                "Contact",
                "Size Guide",
                "Shipping Info",
                "Returns & Exchanges",
                "FAQs",
                "Track Your Order",
                "Gift Cards"
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <div className="space-y-2">
              {[
                "Women's Fashion",
                "Men's Fashion",
                "Electronics",
                "Beauty & Personal Care",
                "Shoes & Accessories",
                "Home & Garden",
                "Sports & Outdoors",
                "Sale Items"
              ].map((category) => (
                <a
                  key={category}
                  href="#"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  123 Fashion Street, Style City, SC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">hello@stylestore.com</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6">
              <h5 className="font-medium mb-3">Why Choose Us?</h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping over $50</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <RotateCcw className="h-4 w-4" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Multiple payment options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} StyleStore. All rights reserved.
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              Cookie Policy
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground mr-2">We accept:</span>
            <div className="flex space-x-1">
              {["Visa", "MC", "AMEX", "PayPal"].map((method) => (
                <div
                  key={method}
                  className="px-2 py-1 bg-muted rounded text-xs font-medium"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;