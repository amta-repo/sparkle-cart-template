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
import { useLanguage } from "@/i18n/LanguageContext";

const ProductListing = () => {
  const { category } = useParams();
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const maxPrice = Math.max(...catalogProducts.map((p) => p.price));
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const isSalePage = pathname === "/sale";

  const baseProducts = useMemo(() => {
    if (isSalePage) return saleProducts;
    if (category && categoryInfo[category as keyof typeof categoryInfo]) return catalogProducts.filter((p) => p.category === category);
    return catalogProducts;
  }, [category, isSalePage]);

  const filteredProducts = useMemo(() => {
    const visible = baseProducts
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
      .filter((p) => !searchTerm || [p.name, p.brand, p.categoryLabel].some((v) => v.toLowerCase().includes(searchTerm.toLowerCase())))
      .filter((p) => selectedCategories.length === 0 || selectedCategories.includes(p.categoryLabel))
      .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand));
    return [...visible].sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "newest": return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
        case "rating": return b.rating - a.rating;
        default: return b.reviewCount - a.reviewCount;
      }
    });
  }, [baseProducts, priceRange, searchTerm, selectedCategories, selectedBrands, sortBy]);

  const currentCategoryInfo = isSalePage
    ? { title: t("listing.sale_title"), description: t("listing.sale_desc") }
    : category && categoryInfo[category as keyof typeof categoryInfo]
      ? categoryInfo[category as keyof typeof categoryInfo]
      : { title: t("listing.all_products"), description: t("listing.all_desc") };

  const handleToggle = (value: string, checked: boolean, items: string[], setter: (items: string[]) => void) => setter(checked ? [...items, value] : items.filter((item) => item !== value));

  const FilterSidebar = () => (
    <div className="w-full space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-sm sm:text-base">{t("listing.price_range")}</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} max={maxPrice} step={500} className="mb-2" />
        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground"><span>{priceRange[0].toLocaleString()}</span><span>{priceRange[1].toLocaleString()}</span></div>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-3 text-sm sm:text-base">{t("listing.categories")}</h3>
        <div className="space-y-2">{categoryNames.map((cn) => <div key={cn} className="flex items-center space-x-2"><Checkbox id={cn} checked={selectedCategories.includes(cn)} onCheckedChange={(checked) => handleToggle(cn, checked as boolean, selectedCategories, setSelectedCategories)} /><label htmlFor={cn} className="text-xs sm:text-sm cursor-pointer">{cn}</label></div>)}</div>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-3 text-sm sm:text-base">{t("listing.brands")}</h3>
        <div className="space-y-2">{brandNames.map((brand) => <div key={brand} className="flex items-center space-x-2"><Checkbox id={brand} checked={selectedBrands.includes(brand)} onCheckedChange={(checked) => handleToggle(brand, checked as boolean, selectedBrands, setSelectedBrands)} /><label htmlFor={brand} className="text-xs sm:text-sm cursor-pointer">{brand}</label></div>)}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <nav className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6"><span>{t("listing.home")}</span> / <span>{currentCategoryInfo.title}</span></nav>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8 gap-4">
          <div><h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{currentCategoryInfo.title}</h1><p className="text-muted-foreground text-sm sm:text-base max-w-2xl">{currentCategoryInfo.description}</p></div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Input type="search" placeholder={t("listing.search")} className="w-full sm:w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-full sm:w-48"><SelectValue placeholder={t("listing.sort")} /></SelectTrigger><SelectContent><SelectItem value="popularity">{t("listing.popularity")}</SelectItem><SelectItem value="price-low">{t("listing.price_low")}</SelectItem><SelectItem value="price-high">{t("listing.price_high")}</SelectItem><SelectItem value="newest">{t("listing.newest")}</SelectItem><SelectItem value="rating">{t("listing.rating")}</SelectItem></SelectContent></Select>
            <div className="hidden sm:flex rounded-lg border"><Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")} className="rounded-r-none"><Grid3X3 className="h-4 w-4" /></Button><Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("list")} className="rounded-l-none"><List className="h-4 w-4" /></Button></div>
          </div>
        </div>
        <div className="flex gap-6 sm:gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0"><div className="sticky top-8"><h2 className="font-semibold text-lg mb-4 flex items-center"><Filter className="h-5 w-5 mr-2" />{t("listing.filters")}</h2><FilterSidebar /></div></aside>
          <div className="flex-1">
            <div className="lg:hidden mb-4 sm:mb-6"><Sheet><SheetTrigger asChild><Button variant="outline" size="sm"><SlidersHorizontal className="h-4 w-4 mr-2" />{t("listing.filters")}</Button></SheetTrigger><SheetContent side="left" className="w-80"><SheetHeader><SheetTitle>{t("listing.filters")}</SheetTitle></SheetHeader><div className="mt-6"><FilterSidebar /></div></SheetContent></Sheet></div>
            <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">{t("listing.showing", { count: filteredProducts.length })}</div>
            {filteredProducts.length === 0 ? <div className="rounded-2xl border bg-card p-8 sm:p-10 text-center"><h2 className="text-lg sm:text-xl font-semibold mb-2">{t("listing.no_match")}</h2><p className="text-muted-foreground text-sm">{t("listing.no_match_sub")}</p></div> : <div className={`grid gap-3 sm:gap-6 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>{filteredProducts.map((product) => <ProductCard key={product.id} {...product} />)}</div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductListing;
