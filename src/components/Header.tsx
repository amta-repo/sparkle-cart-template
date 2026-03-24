import { useState } from "react";
import { Search, ShoppingCart, User, Menu, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { categoryCards, storeName } from "@/data/catalog";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/currency";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import xtenovaLogo from "@/assets/logos/xtenova-logo.png";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navigationItems = [
    ...categoryCards.map((category) => ({ label: t(category.nameKey), href: category.href, highlight: false })),
    { label: t("header.sale"), href: "/sale", highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        <span>{t("header.free_shipping", { threshold: formatPrice(FREE_SHIPPING_THRESHOLD) })}</span>
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={xtenovaLogo} alt="Xtenova Mart logo" className="w-9 h-9 rounded-full object-cover" width={36} height={36} />
            <span className="text-lg sm:text-xl font-bold">{storeName}</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  item.highlight ? "text-primary bg-primary/10 px-3 py-1 rounded-full" : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="hidden lg:flex relative">
              <Input type="search" placeholder={t("header.search")} className="w-52 xl:w-64 pr-10" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <LanguageSwitcher />

            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/wishlist")}>{t("header.my_wishlist")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/cart")}>{t("header.my_cart")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> {t("header.sign_out")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`text-lg font-medium py-2 px-4 rounded-lg transition-colors ${
                        item.highlight ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    {user ? (
                      <>
                        <Link to="/cart" className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-secondary block">{t("header.my_cart")}</Link>
                        <Link to="/wishlist" className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-secondary block">{t("header.my_wishlist")}</Link>
                        <button onClick={() => signOut()} className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-secondary block w-full text-left text-destructive">{t("header.sign_out")}</button>
                      </>
                    ) : (
                      <Link to="/auth" className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-secondary block">{t("header.sign_in")}</Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isSearchOpen && (
          <div className="lg:hidden mt-4 relative">
            <Input type="search" placeholder={t("header.search")} className="w-full pr-10" autoFocus />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
