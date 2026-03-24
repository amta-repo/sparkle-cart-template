import mobileImage from "@/assets/category-mobile.jpg";
import smartTechImage from "@/assets/category-smarttech.jpg";
import solarImage from "@/assets/category-solar.jpg";

export const storeName = "Xtenova Mart";
export const storeEmail = "support@xtenovamart.com";
export const storePhone = "+229 01 91 13 46 72";
export const storeLocation = "Cotonou, Bénin";
export const storeDomain = "xtenovamart.com";

export type CatalogCategory = "mobile-essentials" | "smart-tech" | "solar-power";

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isOnSale?: boolean;
  stockLevel?: "high" | "medium" | "low" | "out";
  stockCount?: number;
  category: CatalogCategory;
  categoryLabel: string;
  brand: string;
}

export const categoryCards = [
  {
    id: "mobile-essentials" as const,
    name: "Mobile Essentials",
    nameKey: "cat.mobile-essentials" as const,
    descKey: "cat.mobile-essentials.desc" as const,
    description: "Smartphones, chargers, power banks, earbuds, and protective cases.",
    image: mobileImage,
    href: "/category/mobile-essentials",
    featured: true,
  },
  {
    id: "smart-tech" as const,
    name: "Smart Tech",
    nameKey: "cat.smart-tech" as const,
    descKey: "cat.smart-tech.desc" as const,
    description: "Smart watches, speakers, mini projectors, ring lights, and USB gear.",
    image: smartTechImage,
    href: "/category/smart-tech",
  },
  {
    id: "solar-power" as const,
    name: "Solar & Power",
    nameKey: "cat.solar-power" as const,
    descKey: "cat.solar-power.desc" as const,
    description: "Solar lamps, solar chargers, compact kits, rechargeable fans, and inverters.",
    image: solarImage,
    href: "/category/solar-power",
  },
];

export const categoryInfo: Record<CatalogCategory, { title: string; description: string }> = {
  "mobile-essentials": {
    title: "Mobile Essentials",
    description: "Everyday smartphone accessories and reliable device essentials for fast-moving customers.",
  },
  "smart-tech": {
    title: "Smart Tech",
    description: "Connected lifestyle gadgets built for entertainment, work setups, and content creation.",
  },
  "solar-power": {
    title: "Solar & Power",
    description: "Off-grid energy and backup power products for homes, travel, and local businesses.",
  },
};

export const catalogProducts: CatalogProduct[] = [
  { id: "me-1", name: "Xtenova Nova 5G Smartphone", price: 189000, originalPrice: 210000, image: mobileImage, rating: 4.8, reviewCount: 214, isOnSale: true, stockLevel: "medium", category: "mobile-essentials", categoryLabel: "Mobile Essentials", brand: "Xtenova Mobile" },
  { id: "me-2", name: "20,000mAh Fast Charge Power Bank", price: 18000, image: mobileImage, rating: 4.7, reviewCount: 168, isNew: true, stockLevel: "high", category: "mobile-essentials", categoryLabel: "Mobile Essentials", brand: "VoltGo" },
  { id: "me-3", name: "USB-C Turbo Wall Charger", price: 7000, image: mobileImage, rating: 4.6, reviewCount: 123, stockLevel: "high", category: "mobile-essentials", categoryLabel: "Mobile Essentials", brand: "ChargeFlex" },
  { id: "me-4", name: "Noise-Isolating Earbuds", price: 16500, originalPrice: 19500, image: mobileImage, rating: 4.7, reviewCount: 201, isOnSale: true, stockLevel: "low", stockCount: 6, category: "mobile-essentials", categoryLabel: "Mobile Essentials", brand: "SoundFlow" },
  { id: "me-5", name: "Shockproof Phone Case", price: 4500, image: mobileImage, rating: 4.5, reviewCount: 89, stockLevel: "high", category: "mobile-essentials", categoryLabel: "Mobile Essentials", brand: "GuardShell" },
  { id: "st-1", name: "Smart Watch Pro", price: 32500, originalPrice: 39000, image: smartTechImage, rating: 4.8, reviewCount: 142, isOnSale: true, stockLevel: "medium", category: "smart-tech", categoryLabel: "Smart Tech", brand: "PulseTime" },
  { id: "st-2", name: "Portable Bluetooth Speaker", price: 24000, image: smartTechImage, rating: 4.7, reviewCount: 196, stockLevel: "high", category: "smart-tech", categoryLabel: "Smart Tech", brand: "BoomBeat" },
  { id: "st-3", name: "Mini LED Projector", price: 69000, image: smartTechImage, rating: 4.6, reviewCount: 78, isNew: true, stockLevel: "medium", category: "smart-tech", categoryLabel: "Smart Tech", brand: "ViewBox" },
  { id: "st-4", name: "Creator Ring Light Kit", price: 12000, originalPrice: 15000, image: smartTechImage, rating: 4.8, reviewCount: 156, isOnSale: true, stockLevel: "high", category: "smart-tech", categoryLabel: "Smart Tech", brand: "LumaGlow" },
  { id: "st-5", name: "Multi-Port USB Hub", price: 9500, image: smartTechImage, rating: 4.5, reviewCount: 110, stockLevel: "high", category: "smart-tech", categoryLabel: "Smart Tech", brand: "PortEase" },
  { id: "sp-1", name: "Rechargeable Solar Lamp", price: 18500, image: solarImage, rating: 4.8, reviewCount: 131, stockLevel: "high", category: "solar-power", categoryLabel: "Solar & Power", brand: "SunGlow" },
  { id: "sp-2", name: "Solar Phone Charger", price: 22000, image: solarImage, rating: 4.6, reviewCount: 94, isNew: true, stockLevel: "medium", category: "solar-power", categoryLabel: "Solar & Power", brand: "EcoVolt" },
  { id: "sp-3", name: "Compact Solar Kit", price: 85000, originalPrice: 96000, image: solarImage, rating: 4.9, reviewCount: 62, isOnSale: true, stockLevel: "low", stockCount: 4, category: "solar-power", categoryLabel: "Solar & Power", brand: "SunGrid" },
  { id: "sp-4", name: "Rechargeable Cooling Fan", price: 28000, image: solarImage, rating: 4.7, reviewCount: 83, stockLevel: "medium", category: "solar-power", categoryLabel: "Solar & Power", brand: "CoolCell" },
  { id: "sp-5", name: "Compact Home Inverter", price: 145000, image: solarImage, rating: 4.5, reviewCount: 24, stockLevel: "out", category: "solar-power", categoryLabel: "Solar & Power", brand: "PowerReserve" },
];

export const featuredProducts = catalogProducts.filter((product) => ["me-1", "me-2", "st-1", "st-3", "sp-1", "sp-3"].includes(product.id));
export const bestSellers = catalogProducts.filter((product) => ["me-4", "st-2", "st-4", "sp-4"].includes(product.id));
export const saleProducts = catalogProducts.filter((product) => product.isOnSale);
export const categoryNames = categoryCards.map((category) => category.name);
export const brandNames = [...new Set(catalogProducts.map((product) => product.brand))];
