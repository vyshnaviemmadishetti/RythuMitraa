import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogPageProps {
  initialCategory?: string;
  searchQuery: string;
  onProductSelect: (p: Product) => void;
  onNavigate: (path: string) => void;
}

// Every spelling of a category -> one canonical id (same map as App.tsx)
const CATEGORY_ALIASES: Record<string, string> = {
  seeds: 'seeds',
  fertilizers: 'fertilizers',
  fertilizer: 'fertilizers',
  protection: 'protection',
  'crop-protection': 'protection',
  irrigation: 'irrigation',
  machinery: 'machinery',
  organic: 'organic',
  'cattle-feed': 'cattle-feed',
  cattle: 'cattle-feed'
};

const normalizeCategory = (value?: string): string => {
  if (!value) return 'all';
  const v = value.replace('catalog-', '').toLowerCase();
  return CATEGORY_ALIASES[v] ?? 'all';
};

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialCategory,
  searchQuery,
  onProductSelect,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(normalizeCategory(initialCategory));
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [onlySubsidized, setOnlySubsidized] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  // Whenever the header / footer / home page sends a new category, update the page
  useEffect(() => {
    setSelectedCategory(normalizeCategory(initialCategory));
  }, [initialCategory]);

  const categories = [
    { id: 'all', label: 'All Products (మొత్తం)' },
    { id: 'seeds', label: 'Seeds (విత్తనాలు)' },
    { id: 'fertilizers', label: 'Fertilizers (ఎరువులు)' },
    { id: 'protection', label: 'Crop Protection (పురుగుమందులు)' },
    { id: 'irrigation', label: 'Irrigation (బిందు సేద్యం)' },
    { id: 'machinery', label: 'Farm Machinery (యంత్రాలు)' },
    { id: 'organic', label: 'Organic Inputs (సేంద్రీయ)' },
    { id: 'cattle-feed', label: 'Cattle Feed (పశుగ్రాసం)' }
  ];

  const crops = [
    { id: 'all', label: 'All Crops' },
    { id: 'paddy', label: 'Paddy / Rice (వరి)' },
    { id: 'cotton', label: 'Cotton (ప్రత్తి)' },
    { id: 'chilli', label: 'Chilli (మిరప)' },
    { id: 'maize', label: 'Maize (మొక్కజొన్న)' },
    { id: 'tomato', label: 'Tomato (టమాటా)' }
  ];

  const brands = [
    'all',
    'Bayer CropScience',
    'Coromandel International',
    'Syngenta India',
    'IFFCO Cooperative',
    'Multiplex Group',
    'Jain Irrigation Systems',
    'Neptune Farming Solutions',
    'Tata Rallis'
  ];

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCrop('all');
    setSelectedBrand('all');
    setOnlySubsidized(false);
    setMaxPrice(10000);
  };

  // Filtering
  const filtered = PRODUCTS.filter((p) => {
    // Search query match
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchLocal = p.localName ? p.localName.toLowerCase().includes(q) : false;
      if (!matchName && !matchDesc && !matchBrand && !matchLocal) return false;
    }

    // Category: compare canonical ids so "crop-protection" == "protection", "cattle" == "cattle-feed"
    if (selectedCategory !== 'all') {
      const productCategory = normalizeCategory(p.category);
      const rawProductCategory = String(p.category).toLowerCase();
      const isMatch =
        productCategory === selectedCategory ||
        rawProductCategory.includes(selectedCategory) ||
        selectedCategory.includes(rawProductCategory);
      if (!isMatch) return false;
    }

    // Crop tag
    if (selectedCrop !== 'all' && !p.cropTags.includes(selectedCrop)) {
      return false;
    }

    // Brand
    if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
      return false;
    }

    // Subsidized
    if (onlySubsidized && !p.isSubsidized) {
      return false;
    }

    // Price
    if (p.price > maxPrice) {
      return false;
    }

    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    return 0; // relevance
  });

  const activeCategoryLabel =
    categories.find((c) => c.id === selectedCategory)?.label ?? 'All Products (మొత్తం)';

  return (
    <div className="flex flex-col w-full">
      {/* Search Header Banner */}
      <div className="w-full bg-surface-container-low px-4 md:px-8 py-4 border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
              East Godavari Hub • Kharif Season Verified
            </div>
            <h1 className="font-serif font-bold text-xl md:text-2xl text-on-surface">
              {activeCategoryLabel}
            </h1>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {sorted.length} genuine agricultural inputs found
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Direct farm delivery available to{' '}
              <strong className="text-primary">Peddapuram Village & 14 surrounding mandals</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-on-surface-variant font-bold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container-lowest text-on-surface rounded-lg px-3 py-1.5 border border-outline-variant/40 focus:outline-none font-bold"
            >
              <option value="relevance">Relevance (సిఫార్సు)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Farmer Rating</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (3 cols): Filters */}
          <aside className="lg:col-span-3 bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-variant/30 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-surface-variant/40">
              <span className="font-serif font-bold text-sm text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                Filters (వడపోతలు)
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-secondary font-bold hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-1.5">
              <span className="font-bold text-on-surface block uppercase tracking-wider text-[10px]">
                Primary Category
              </span>
              <div className="space-y-1">
                {categories.map((c) => (
                  <label
                    key={c.id}
                    className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                      selectedCategory === c.id
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span>{c.label}</span>
                    <input
                      type="radio"
                      name="cat"
                      checked={selectedCategory === c.id}
                      onChange={() => setSelectedCategory(c.id)}
                      className="accent-primary"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Crop Filter */}
            <div className="space-y-1.5">
              <span className="font-bold text-on-surface block uppercase tracking-wider text-[10px]">
                Crop Suitability (పంట)
              </span>
              <div className="flex flex-wrap gap-1">
                {crops.map((cr) => (
                  <button
                    key={cr.id}
                    type="button"
                    onClick={() => setSelectedCrop(cr.id)}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      selectedCrop === cr.id
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {cr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-on-surface uppercase tracking-wider text-[10px]">
                  Price Under
                </span>
                <span className="font-sans font-bold text-primary">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min={100}
                max={10000}
                step={200}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-outline">
                <span>Min: ₹100</span>
                <span>Max: ₹10,000</span>
              </div>
            </div>

            {/* Subsidized Checkbox */}
            <div className="pt-2 border-t border-surface-variant/40 space-y-2">
              <label className="flex items-center gap-2 p-1.5 rounded hover:bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlySubsidized}
                  onChange={(e) => setOnlySubsidized(e.target.checked)}
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
                <span className="font-bold text-primary">DBT Subsidy Eligible Only</span>
              </label>
            </div>

            {/* Brand Filter */}
            <div className="space-y-1.5">
              <span className="font-bold text-on-surface block uppercase tracking-wider text-[10px]">
                Manufacturer / Brand
              </span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-surface-container-low px-2.5 py-1.5 rounded border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'all' ? 'All Manufacturers' : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Kisan Advisory Callout */}
            <div className="bg-secondary-fixed/20 p-3 rounded-xl border border-secondary/30 space-y-1">
              <span className="font-bold text-primary block flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">support_agent</span>
                Kisan Helpline
              </span>
              <p className="text-[11px] text-on-surface-variant">
                Free advice on seed soaking & dosage calculation before placing order:
              </p>
              <a
                href="tel:18001801551"
                className="font-bold text-primary hover:underline block pt-1 text-xs"
              >
                1800-180-1551
              </a>
            </div>
          </aside>

          {/* Right Column (9 cols): Product Grid */}
          <section className="lg:col-span-9 space-y-4">
            {sorted.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-10 text-center space-y-3 border border-surface-variant/30">
                <span className="material-symbols-outlined text-[36px] text-outline">search_off</span>
                <h3 className="font-serif font-bold text-base text-primary">
                  No products match this filter
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Try clearing filters or searching for &quot;Paddy&quot;, &quot;Urea&quot;,
                  &quot;Drip&quot;, or &quot;Sprayer&quot;.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold"
                  >
                    Clear All Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-bold"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {sorted.map((p) => (
                  <ProductCard key={p.id} product={p} onSelect={onProductSelect} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};