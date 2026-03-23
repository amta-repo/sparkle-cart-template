import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { brandNames, catalogProducts, categoryCards, categoryInfo, categoryNames, saleProducts } from "@/data/catalog";

const ProductListing = () => {
  const { category } = useParams();
  const { pathname } = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const maxPrice = Math.max(...catalogProducts.map((product) => product.price));
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const isSalePage = pathname === "/sale";

  const baseProducts = useMemo(() => {
    if (isSalePage) return saleProducts;
    if (category && categoryInfo[category as keyof typeof categoryInfo]) return catalogProducts.filter((product) => product.category === category);
    return catalogProducts;
  }, [category, isSalePage]);

  const filteredProducts = useMemo(() => {
    const visibleProducts = baseProducts
      .filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])
      .filter((product) => !searchTerm || [product.name, product.brand, product.categoryLabel].some((value) => value.toLowerCase().includes(searchTerm.toLowerCase())))
      .filter((product) => selectedCategories.length === 0 || selectedCategories.includes(product.categoryLabel))
      .filter((product) => selectedBrands.length === 0 || selectedBrands.includes(product.brand));
    return [...visibleProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "newest": return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
        case "rating": return b.rating - a.rating;
        default: return b.reviewCount - a.reviewCount;
      }
    });
  }, [baseProducts, priceRange, searchTerm, selectedCategories, selectedBrands, sortBy]);

  const currentCategoryInfo = isSalePage ? { title: "Sale Items", description: "The best current discounts across mobile accessories, smart tech, and solar power." } : category && categoryInfo[category as keyof typeof categoryInfo] ? categoryInfo[category as keyof typeof categoryInfo] : { title: "All Products", description: "Browse the complete XTenova Market catalog." };
  const handleToggle = (value: string, checked: boolean, items: string[], setter: (items: string[]) => void) => setter(checked ? [...items, value] : items.filter((item) => item !== value));

  const FilterSidebar = () => (
    <div className="w-full space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} max={maxPrice} step={500} className="mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground"><span>{priceRange[0].toLocaleString()}</span><span>{priceRange[1].toLocaleString()}</span></div>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">{categoryNames.map((categoryName) => <div key={categoryName} className="flex items-center space-x-2"><Checkbox id={categoryName} checked={selectedCategories.includes(categoryName)} onCheckedChange={(checked) => handleToggle(categoryName, checked as boolean, selectedCategories, setSelectedCategories)} /><label htmlFor={categoryName} className="text-sm cursor-pointer">{categoryName}</label></div>)}</div>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">{brandNames.map((brand) => <div key={brand} className="flex items-center space-x-2"><Checkbox id={brand} checked={selectedBrands.includes(brand)} onCheckedChange={(checked) => handleToggle(brand, checked as boolean, selectedBrands, setSelectedBrands)} /><label htmlFor={brand} className="text-sm cursor-pointer">{brand}</label></div>)}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <nav className="text-sm text-muted-foreground mb-6"><span>Home</span> / <span>{currentCategoryInfo.title}</span></nav>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div><h1 className="text-3xl font-bold mb-2">{currentCategoryInfo.title}</h1><p className="text-muted-foreground max-w-2xl">{currentCategoryInfo.description}</p></div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Input type="search" placeholder="Search products..." className="w-full sm:w-64" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent><SelectItem value="popularity">Most Popular</SelectItem><SelectItem value="price-low">Price: Low to High</SelectItem><SelectItem value="price-high">Price: High to Low</SelectItem><SelectItem value="newest">Newest First</SelectItem><SelectItem value="rating">Highest Rated</SelectItem></SelectContent></Select>
            <div className="flex rounded-lg border"><Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")} className="rounded-r-none"><Grid3X3 className="h-4 w-4" /></Button><Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("list")} className="rounded-l-none"><List className="h-4 w-4" /></Button></div>
          </div>
        </div>
        {!category && !isSalePage && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">{categoryCards.map((item) => <div key={item.id} className="rounded-2xl border bg-card p-5"><p className="font-semibold">{item.name}</p><p className="text-sm text-muted-foreground mt-1">{item.description}</p></div>)}</div>}
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0"><div className="sticky top-8"><h2 className="font-semibold text-lg mb-4 flex items-center"><Filter className="h-5 w-5 mr-2" />Filters</h2><FilterSidebar /></div></aside>
          <div className="flex-1">
            <div className="lg:hidden mb-6"><Sheet><SheetTrigger asChild><Button variant="outline"><SlidersHorizontal className="h-4 w-4 mr-2" />Filters</Button></SheetTrigger><SheetContent side="left" className="w-80"><SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader><div className="mt-6"><FilterSidebar /></div></SheetContent></Sheet></div>
            <div className="mb-4 text-sm text-muted-foreground">Showing {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}</div>
            {filteredProducts.length === 0 ? <div className="rounded-2xl border bg-card p-10 text-center"><h2 className="text-xl font-semibold mb-2">No products match your filters</h2><p className="text-muted-foreground">Try removing a filter or searching for another item.</p></div> : <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>{filteredProducts.map((product) => <ProductCard key={product.id} {...product} />)}</div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductListing;
