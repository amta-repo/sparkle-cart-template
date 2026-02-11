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

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const navigationItems = [
    { label: "Clothing", href: "/category/clothing" },
    { label: "Shoes", href: "/category/shoes" },
    { label: "Gadgets", href: "/category/gadgets" },
    { label: "Cosmetics", href: "/category/cosmetics" },
    { label: "Sale", href: "/sale", highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        <span>🚚 Free shipping on orders above $50 | 🔥 Sale ends in 2 days!</span>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">StyleStore</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  item.highlight
                    ? "text-primary bg-primary/10 px-3 py-1 rounded-full"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex relative">
              <Input type="search" placeholder="Search products..." className="w-64 pr-10" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

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
                  <DropdownMenuItem onClick={() => navigate("/wishlist")}>My Wishlist</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/cart")}>My Cart</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
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
                    <Link key={item.label} to={item.href}
                      className={`text-lg font-medium py-2 px-4 rounded-lg transition-colors ${
                        item.highlight ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                      }`}
                    >{item.label}</Link>
                  ))}
                  <div className="pt-4 border-t">
                    {user ? (
                      <>
                        <Link to="/cart" className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-secondary block">My Cart</Link>
                        <Link to="/wishlist" className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-secondary block">My Wishlist</Link>
                        <button onClick={() => signOut()} className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-secondary block w-full text-left text-destructive">Sign Out</button>
                      </>
                    ) : (
                      <Link to="/auth" className="text-lg font-medium py-2 px-4 rounded-lg hover:bg-secondary block">Sign In</Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isSearchOpen && (
          <div className="lg:hidden mt-4 relative">
            <Input type="search" placeholder="Search products..." className="w-full pr-10" autoFocus />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
