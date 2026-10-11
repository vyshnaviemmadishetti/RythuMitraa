import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data';
import { useApp } from '../context/AppContext';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (path: string) => void;
  onOpenScanner: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onOpenScanner
}) => {
  const { addToCart, toggleWishlist, isInWishlist, showToast, currentPincode } = useApp();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(2);
  const [activeTab, setActiveTab] = useState<'advisory' | 'lab' | 'suitability'>('advisory');
  const [pincodeCheck, setPincodeCheck] = useState(currentPincode);
  const [pincodeVerified, setPincodeVerified] = useState(true);

  const images = [product.image, ...(product.additionalImages || [])];
  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onNavigate('cart');
  };

  const handleAddBundle = () => {
    addToCart(product, 1);
    const carb = PRODUCTS.find((p) => p.id === 'carbendazim-50-wp-500g');
    const zinc = PRODUCTS.find((p) => p.id === 'zinc-sulphate-33-5kg');
    if (carb) addToCart(carb, 1);
    if (zinc) addToCart(zinc, 1);
    showToast(`Added Complete Paddy Nursery Bundle (₹1,360) to Cart with ₹110 savings!`, 'shopping_bag');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb Bar */}
      <div className="w-full bg-surface-container-low py-2 px-4 md:px-8 border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap text-xs">
          <nav className="flex items-center gap-1.5 text-on-surface-variant overflow-x-auto whitespace-nowrap py-1">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </button>
            <span className="text-outline-variant font-bold">/</span>
            <button
              onClick={() => onNavigate(`catalog-${product.category}`)}
              className="hover:text-primary transition-colors capitalize cursor-pointer"
            >
              {product.category}
            </button>
            <span className="text-outline-variant font-bold">/</span>
            <span className="text-primary font-bold truncate max-w-[200px] md:max-w-none">
              {product.name}
            </span>
          </nav>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-lowest shadow-xs text-secondary font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Direct Dispatch: East Godavari Hub
            </span>
            <span className="hidden sm:inline text-outline">•</span>
            <span className="hidden sm:inline font-mono">SKU: {product.sku}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Gallery & Lab Proof */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="relative bg-surface-container-lowest rounded-2xl p-4 shadow-sm overflow-hidden border border-surface-variant/30">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
                <span className="bg-secondary text-on-secondary px-2.5 py-0.5 rounded text-xs shadow-sm font-bold tracking-wide">
                  {product.discountPercent}% OFF
                </span>
                {product.isSubsidized && (
                  <span className="bg-surface-container-high text-primary px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                    AP DBT Verified
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                  isSaved ? 'text-error' : 'text-outline hover:text-error'
                }`}
                title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <span className={`material-symbols-outlined text-[22px] ${isSaved ? 'fill' : ''}`}>
                  favorite
                </span>
              </button>

              {/* Main Showcase Image */}
              <div className="relative w-full aspect-square rounded-xl bg-surface-container-low overflow-hidden flex items-center justify-center group">
                <img
                  src={images[selectedImageIndex] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-inverse-surface/80 text-inverse-on-surface backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                  <span>Examine Seed Batch Proof</span>
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2.5 mt-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative rounded-lg overflow-hidden aspect-square bg-surface-container-low shadow-xs transition-all p-0.5 cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'ring-2 ring-primary opacity-100'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded" />
                      <span className="absolute bottom-0 inset-x-0 bg-primary/85 text-on-primary text-[9px] py-0.5 text-center truncate">
                        {idx === 0 ? 'Bag Pack' : idx === 1 ? 'Field Panicle' : idx === 2 ? 'Lab Test' : 'Subsidy QR'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Proof Micro-Bar */}
            <div className="bg-surface-container rounded-xl p-4 grid grid-cols-3 gap-2 text-center border border-outline-variant/30">
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-secondary text-[26px]">energy_savings_leaf</span>
                <span className="font-serif font-bold text-base md:text-lg text-primary mt-1">98%</span>
                <span className="text-[11px] text-on-surface-variant">Germination Rate</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-secondary text-[26px]">water_drop</span>
                <span className="font-serif font-bold text-base md:text-lg text-primary mt-1">11.5%</span>
                <span className="text-[11px] text-on-surface-variant">Moisture Ratio</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-secondary text-[26px]">verified</span>
                <span className="font-serif font-bold text-base md:text-lg text-primary mt-1">BLB-Tolerant</span>
                <span className="text-[11px] text-on-surface-variant">Genetic Purity 99%</span>
              </div>
            </div>

            {/* Quick AI Diagnostic Banner */}
            <div className="bg-surface-container-high rounded-xl p-4 flex items-center justify-between gap-4 border border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">document_scanner</span>
                </div>
                <div>
                  <p className="font-bold text-xs md:text-sm text-primary">Unsure about your soil suitability?</p>
                  <p className="text-xs text-on-surface-variant">
                    Scan your field soil test card or previous paddy leaf with AI Scanner.
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenScanner}
                className="px-3.5 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors shrink-0 shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <span>AI Doctor</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Purchase Details */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-secondary tracking-wider uppercase">
                  {product.brand}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded font-bold">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container fill">star</span>
                  <strong className="text-on-surface">{product.rating}</strong> ({product.reviewCount} reviews)
                </span>
              </div>
              <h1 className="font-serif font-bold text-xl md:text-2xl text-primary tracking-tight leading-tight">
                {product.name}
              </h1>
              {product.localName && (
                <p className="font-serif italic text-xs md:text-sm text-on-surface-variant">
                  {product.localName}
                </p>
              )}
            </div>

            {/* Trust Badges Strip */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary text-xs font-bold shadow-xs border border-surface-variant/40">
                <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
                ICAR Certified
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary text-xs font-bold shadow-xs border border-surface-variant/40">
                <span className="material-symbols-outlined text-secondary text-[16px]">workspace_premium</span>
                98% Germination Assured
              </span>
              {product.isSubsidized && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[16px]">account_balance</span>
                  Subsidy Eligible (AP/TS DBT)
                </span>
              )}
            </div>

            {/* Pricing Card */}
            <div className="bg-surface-container-lowest rounded-xl p-4 md:p-5 shadow-sm flex flex-col gap-3 border border-surface-variant/30">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="font-extrabold text-3xl text-primary font-sans leading-none">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-outline line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded">
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discountPercent}% OFF)
                </span>
                <span className="text-xs text-on-surface-variant block w-full mt-1">
                  ₹{(product.price / 3).toFixed(2)} / kg • Inclusive of all GST & State Mandi Cess
                </span>
              </div>

              {/* Direct DBT Subsidy Explainer Box */}
              {product.isSubsidized && (
                <div className="bg-surface-container-high rounded-lg p-3 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-tertiary-container text-[24px] mt-0.5 shrink-0">
                    savings
                  </span>
                  <div className="flex flex-col text-xs leading-relaxed">
                    <span className="font-bold text-primary">
                      Govt Subsidy: Save extra ₹150 with Rythu Bharosa / PM-KISAN DBT
                    </span>
                    <p className="text-on-surface-variant mt-0.5">
                      Claim via Aadhaar-linked Kisan Passbook voucher at checkout. Net effective cost: <strong>₹690 / bag</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Package Variant Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface">Package Size (ప్యాక్ సైజు)</span>
                <span className="text-on-surface-variant">Recommended: 6-8 kg for 1 Acre Nursery</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-container-lowest shadow-xs ring-2 ring-primary text-primary font-bold text-xs"
                >
                  <span>3 kg Bag</span>
                  <span className="text-[10px] text-secondary font-bold">₹840 (In Stock)</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Selected 6 kg Twin Pack', 'inventory_2')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-container-lowest shadow-xs opacity-75 hover:opacity-100 text-on-surface text-xs"
                >
                  <span>6 kg Twin Pack</span>
                  <span className="text-[10px] text-on-surface-variant">₹1,650 (Save ₹30)</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Selected 25 kg Farmer Bale', 'inventory_2')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-container-lowest shadow-xs opacity-75 hover:opacity-100 text-on-surface text-xs"
                >
                  <span>25 kg Farmer Bale</span>
                  <span className="text-[10px] text-on-surface-variant">₹6,750 (Wholesale)</span>
                </button>
              </div>
            </div>

            {/* Bulk Farming Discounts Tier Box */}
            <div className="bg-surface-container-low rounded-xl p-3.5 space-y-2 border border-outline-variant/30">
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-secondary">groups</span>
                  Rythu Group & Acreage Bulk Discount
                </span>
                <span className="text-secondary font-bold">Instant Price Drop</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-surface-container-lowest p-2 rounded shadow-xs">
                  <span className="block text-[10px] text-on-surface-variant">1 - 4 Bags</span>
                  <span className="block font-bold text-on-surface font-sans">₹840 / bag</span>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded shadow-xs ring-1 ring-secondary">
                  <span className="block text-[10px] text-secondary font-bold">5 - 19 Bags (1-3 Acres)</span>
                  <span className="block font-bold text-secondary font-sans">₹810 / bag</span>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded shadow-xs">
                  <span className="block text-[10px] text-on-surface-variant">20+ Bags (FPO Level)</span>
                  <span className="block font-bold text-on-surface font-sans">₹785 / bag</span>
                </div>
              </div>
            </div>

            {/* Delivery Estimator & Village Pin Code Check */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-2.5 border border-surface-variant/30">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[18px]">local_shipping</span>
                  Village Farm Delivery Estimator
                </span>
                <span className="text-secondary font-bold">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                    pin_drop
                  </span>
                  <input
                    type="text"
                    value={pincodeCheck}
                    onChange={(e) => setPincodeCheck(e.target.value)}
                    placeholder="Enter 6-digit Pincode"
                    className="w-full bg-surface-container-low pl-8 pr-3 py-2 rounded-lg text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPincodeVerified(true);
                    showToast(`Delivery available for ${pincodeCheck}! 2 Days to Farm Gate.`);
                  }}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Verify
                </button>
              </div>

              {pincodeVerified && (
                <div className="bg-surface-container-low p-2.5 rounded-lg text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-secondary font-bold">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>Estimated Delivery: 2 Days to Farm Gate (by Thursday, 4 PM)</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px]">
                    Delivered via Godavari Agro Hub. <strong>Cash on Delivery</strong> & <strong>Kisan Credit Card (KCC)</strong> accepted.
                  </p>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Add to Cart Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              {/* Stepper */}
              <div className="flex items-center justify-between bg-surface-container-lowest rounded-lg shadow-sm p-1 border border-surface-variant/40 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded text-on-surface hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <div className="flex flex-col items-center px-4 min-w-[65px]">
                  <span className="font-sans font-bold text-lg text-primary leading-none">
                    {quantity}
                  </span>
                  <span className="text-[10px] text-on-surface-variant uppercase mt-0.5">
                    Bags ({quantity * 3} kg)
                  </span>
                </div>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded text-on-surface hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 w-full h-11 rounded-lg bg-surface-container-lowest border-2 border-primary text-primary font-bold text-xs md:text-sm hover:bg-primary/5 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>Add to Cart • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="flex-1 w-full h-11 rounded-lg bg-primary text-on-primary font-bold text-xs md:text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">flash_on</span>
                <span>Buy Now (రైతు ఆర్డర్)</span>
              </button>
            </div>

            {/* Certified Merchant Card */}
            <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs flex items-center justify-between gap-3 border border-surface-variant/30 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary font-bold">
                  <span className="material-symbols-outlined text-[22px]">store</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-primary">Godavari Krishi Kendra</span>
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px]">
                    AP Agri Dept License: <strong>#AGR-EG-2022-8941</strong> • Peddapuram
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-0.5 bg-secondary text-on-secondary px-2 py-0.5 rounded font-bold text-[11px]">
                  4.9 <span className="material-symbols-outlined text-[12px] fill">star</span>
                </span>
                <span className="block text-[10px] text-on-surface-variant mt-0.5">3.4k Dispatches</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS SECTION: Technical Advisory, Lab Quality, Cultivation Protocol */}
        <div className="mt-8 bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/30">
          <div className="flex items-center gap-2 overflow-x-auto bg-surface-container p-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('advisory')}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'advisory'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">psychology_alt</span>
              <span>Agronomist Advisory & Prescription</span>
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'lab'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">biotech</span>
              <span>Laboratory Quality Certificate</span>
            </button>
            <button
              onClick={() => setActiveTab('suitability')}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'suitability'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Season & Soil Suitability</span>
            </button>
          </div>

          <div className="p-5 md:p-8">
            {activeTab === 'advisory' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-1 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-[26px]">speed</span>
                    <h4 className="font-serif font-bold text-sm text-primary">Crop Duration</h4>
                    <p className="text-xs text-on-surface">
                      <strong>130 – 135 Days</strong> (Medium maturity duration suited for primary Kharif & Rabi cycles).
                    </p>
                    <span className="text-[11px] text-on-surface-variant mt-auto pt-2">
                      Allows timely post-harvest Rabi pulses sowing
                    </span>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-1 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-[26px]">scatter_plot</span>
                    <h4 className="font-serif font-bold text-sm text-primary">Prescribed Seed Rate</h4>
                    <p className="text-xs text-on-surface">
                      <strong>6 – 8 kg per Acre</strong> for transplanted nursery beds; 10 kg for direct dry seeding (DSR).
                    </p>
                    <span className="text-[11px] text-on-surface-variant mt-auto pt-2">
                      Recommended spacing: 20 cm x 15 cm
                    </span>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-1 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-[26px]">healing</span>
                    <h4 className="font-serif font-bold text-sm text-primary">Disease Shield</h4>
                    <p className="text-xs text-on-surface">
                      <strong>High Field Tolerance</strong> to Bacterial Leaf Blight (BLB / బాక్టీరియా ఆకు ఎండు తెగులు) & lodging.
                    </p>
                    <span className="text-[11px] text-on-surface-variant mt-auto pt-2">
                      Sturdy thick culm prevents flattening during rainstorms
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-primary shrink-0"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBes5SgE0mgmNysjyRqPmB-eeIWcKDAdAyJZA8Kcma0bBI1ampxqqkbN7zRGFE-POnysXxJnVjpDsiDZCW1CD4ehFpKrzRbRdiR5fZugyq5DIYRAf2XuQRSXkuUlLm2rj4_-adC7OBc1sS2fJpG4_LjxUhjgLqpIPueFOYkLZC6V_8pckey7GbQXxe8TffHhuZ14wjUk1u68YW5vYsS86dycpZmgvoe59Kh3b0rYPfneZXUsxHpXoi1"
                      alt="Dr. K. Srinivas Rao"
                    />
                    <div className="flex flex-col text-xs">
                      <span className="text-[10px] uppercase text-secondary font-bold">
                        Kisan Advisory Desk • రైతు శాస్త్రవేత్త సలహా
                      </span>
                      <h4 className="font-bold text-sm text-primary">
                        Dr. K. Srinivas Rao, Senior Agronomist (ANGRAU Alumni)
                      </h4>
                      <p className="text-on-surface-variant mt-0.5">
                        “Arize 6444 Gold delivers 25-30% higher grain yield than conventional open-pollinated varieties. Ensure Carbendazim seed soaking 24 hours prior to germination bed broadcasting.”
                      </p>
                    </div>
                  </div>
                  <a
                    href="tel:18001801551"
                    className="shrink-0 w-full md:w-auto px-4 py-2.5 bg-primary-container text-on-primary rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                    <span>Agri-Doctor Helpline (1800-180-1551)</span>
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'lab' && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 text-xs">
                  <div>
                    <span className="font-bold text-secondary uppercase tracking-wider text-[11px]">
                      AP State Seed Testing Laboratory • Bapatla
                    </span>
                    <h4 className="font-serif font-bold text-sm text-primary">
                      Batch Test Certificate #AP-2025-0914-AZ
                    </h4>
                    <p className="text-on-surface-variant text-[11px]">
                      Tested on 12-January-2025 • Valid until 11-October-2025
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">task_alt</span>
                    Passed Grade-A Standards
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-variant/40">
                    <span className="text-xs text-on-surface-variant block">Physical Purity</span>
                    <span className="font-sans font-extrabold text-xl text-primary block mt-1">99.2%</span>
                    <span className="text-[10px] text-secondary font-bold block">Min standard: 98.0%</span>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-variant/40">
                    <span className="text-xs text-on-surface-variant block">Germination Capacity</span>
                    <span className="font-sans font-extrabold text-xl text-primary block mt-1">98.0%</span>
                    <span className="text-[10px] text-secondary font-bold block">Min standard: 80.0%</span>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-variant/40">
                    <span className="text-xs text-on-surface-variant block">Moisture Content</span>
                    <span className="font-sans font-extrabold text-xl text-primary block mt-1">11.5%</span>
                    <span className="text-[10px] text-secondary font-bold block">Max limit: 13.0%</span>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-variant/40">
                    <span className="text-xs text-on-surface-variant block">Genetic Purity</span>
                    <span className="font-sans font-extrabold text-xl text-primary block mt-1">98.5%</span>
                    <span className="text-[10px] text-secondary font-bold block">GOT Lab Verified</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'suitability' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-2">
                  <h4 className="font-serif font-bold text-sm text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary">terrain</span>
                    Ideal Soil Formations
                  </h4>
                  <ul className="space-y-1.5 text-on-surface">
                    <li className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                      <span><strong>Clay Loam & Heavy Alluvial Soils:</strong> Outstanding water retention and high grain filling efficiency.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                      <span><strong>Deltaic Coastal Soils:</strong> Tolerates mild surface salinity during early seedling tillering stages.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-2">
                  <h4 className="font-serif font-bold text-sm text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary">wb_sunny</span>
                    Sowing Calendar
                  </h4>
                  <ul className="space-y-1.5 text-on-surface">
                    <li className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">event</span>
                      <span><strong>Kharif (Sarva):</strong> May 25 – July 15 (Nursery sowing). Peak yields 28-32 bags/acre.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">event</span>
                      <span><strong>Rabi (Dalwa):</strong> November 15 – December 25. Excellent cold endurance during vegetative phase.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER BUNDLE */}
        <div className="mt-8 bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-sm border border-surface-variant/30">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Farmer Essential Package</span>
              <h3 className="font-serif font-bold text-base md:text-lg text-primary">Frequently Bought Together for Paddy Nursery</h3>
            </div>
            <span className="bg-secondary-container text-on-secondary-fixed text-xs font-bold px-3 py-1 rounded-full">
              Bundle Discount: Save Extra ₹110
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 flex flex-col sm:flex-row items-center gap-3">
              {/* Item 1 */}
              <div className="w-full sm:w-1/3 bg-surface-container-low rounded-lg p-2.5 flex flex-col items-center text-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded mb-1"
                />
                <span className="font-bold text-xs text-primary truncate w-full">{product.name}</span>
                <span className="text-[10px] text-on-surface-variant">Primary Seed Input</span>
                <span className="font-bold text-xs text-primary mt-1 font-sans">₹840</span>
              </div>
              <span className="text-outline font-bold text-lg hidden sm:block">+</span>
              {/* Item 2 */}
              <div className="w-full sm:w-1/3 bg-surface-container-low rounded-lg p-2.5 flex flex-col items-center text-center">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9xIIQHaWA3ZQ0uyZfVrG5jYtKRaBuRx-3r-K2BxIBcUkrni_gTiO1M3irVbGvNOtCWUH9pCWy0yJHk_2hqtRTBqGImP5le3HikGke1VJKSlDrXDYPeYvv8uT3pyTNqJQ-0mp9_lybBSXJDd5NvbwB00QQn-HG2crHdntAH-hvA81404EZ0WJ55UD554-0Rzy2qTx9I7moa-FjkHt-NAsGuE6XKq0ymKqeGYZMsBpG_jV5rdPkXlsh"
                  alt="Carbendazim"
                  className="w-16 h-16 object-cover rounded mb-1"
                />
                <span className="font-bold text-xs text-primary truncate w-full">Carbendazim 50% WP (500g)</span>
                <span className="text-[10px] text-on-surface-variant">Seed Treatment Shield</span>
                <span className="font-bold text-xs text-primary mt-1 font-sans">₹290</span>
              </div>
              <span className="text-outline font-bold text-lg hidden sm:block">+</span>
              {/* Item 3 */}
              <div className="w-full sm:w-1/3 bg-surface-container-low rounded-lg p-2.5 flex flex-col items-center text-center">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYxH35VhWekJhNZLYAdmgezK8XEV6cVXqa5Nmblkk5vEMsNjXcbO_2EL2CcKuCaEoY8qMWRbVPYL1u_8l7xWbj05dgrxwtCx4_CPZW9vBhrm98zfrdACOC_WGFNq8wy4F3M1MC8icCI3Nay7gcfGmjrnKvWBcEscukXbl1A_PZ0yBhFRJuDqtciIcOCu8mt38opwa_2PDpJX6AWmRqTSQbkHLeeTJe63LmUn4FPfcz1fup5BV1qnMG"
                  alt="Zinc Sulphate"
                  className="w-16 h-16 object-cover rounded mb-1"
                />
                <span className="font-bold text-xs text-primary truncate w-full">Zinc Sulphate 33% (5 kg)</span>
                <span className="text-[10px] text-on-surface-variant">Root & Tiller Booster</span>
                <span className="font-bold text-xs text-primary mt-1 font-sans">₹340</span>
              </div>
            </div>

            {/* Bundle Checkout Box */}
            <div className="md:col-span-4 bg-surface-container rounded-xl p-4 flex flex-col gap-2.5 border border-outline-variant/30">
              <span className="text-xs text-on-surface-variant">Bundle Price (3 Items):</span>
              <div className="flex items-baseline gap-2">
                <span className="font-sans font-extrabold text-2xl text-primary">₹1,360</span>
                <span className="text-xs text-outline line-through">₹1,470</span>
              </div>
              <span className="text-[11px] text-secondary font-bold">Includes free seed coating glove kit</span>
              <button
                onClick={handleAddBundle}
                className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_box</span>
                <span>Add Complete Bundle to Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* VERIFIED FARMER REVIEWS */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Ground Truth & Field Experiences</span>
              <h3 className="font-serif font-bold text-base md:text-lg text-primary">Verified Farmer Reviews (రైతుల సమీక్షలు)</h3>
            </div>
            <button
              onClick={() => showToast('Yield report submission open for registered harvesting season farmers', 'info')}
              className="px-3 py-1.5 bg-surface-container-lowest text-primary rounded-lg text-xs font-bold shadow-xs border border-surface-variant/40 hover:bg-surface-container cursor-pointer"
            >
              Submit Yield Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-variant/30 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6_OfBZrf3neSIfjEYaR6BURFGfEzl8kW_iZKrmxrOuTIZMciVazLML9Ucn8XQIn2Kxe3-NhHqO3GuT_iHlkJcGRSNK6g7dQstGjZBGc-BEgyPMSAZz5umF7zyt9my2WQ5FIKuoyxHLIs231ravrJAcyQwPR9g809jwLhe0WHJLyupdUdM2pTtDxNoYulk4uRdWVe1hjQw8_RHkyR5QgWd6TbT1NPRcDNR3-EicMcpoLjKJ7PpslZ4"
                    alt="Venkata Subba Rao"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-primary">Venkata Subba Rao</h4>
                    <p className="text-[11px] text-on-surface-variant">East Godavari, AP • 6 Acres</p>
                  </div>
                </div>
                <span className="bg-surface-container-high text-secondary px-2 py-0.5 rounded text-[10px] font-bold">
                  Verified Buyer
                </span>
              </div>
              <div className="flex items-center gap-1 text-secondary text-xs">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[14px] fill">star</span>
                ))}
                <span className="text-on-surface-variant ml-2 text-[10px]">Harvested Dec 2024</span>
              </div>
              <p className="text-xs text-on-surface leading-relaxed">
                “విత్తనాల మొలక శాతం 98% ఖచ్చితంగా వచ్చింది. గత ఖరీఫ్‌లో ఎకరాకు 31 బస్తాల దిగుబడి వచ్చింది. వర్షం పడినా వరి పైరు నేలకొరగలేదు. బేయర్ అరిజ్ 6444 గోల్డ్ నాణ్యత చాలా బాగుంది.”
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-variant/30 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkRyef-k2dJZZKAsOS4j7XmzSQxtipZWYUzI2am-dBZeS_8smU7ttFM5R3lPuFyF1oXkPMe-Yb85IUSV_lfHBs_GhEW8RJsrFcQa3g6GHrw477gjhxeW17nkgpNfpwfhuoaaR4zCv5yvbGu3C75rbWOQvoyqmGYqcNBu-VDXf5TnExgR-6t0gX9pST5gTwbRU_YPa3u8fPYmmeUXYOKBpJSMYDfvZoQY47yZiSR9ZdG2QlN9qvApOj"
                    alt="Mallikarjun Goud"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-primary">Mallikarjun Goud</h4>
                    <p className="text-[11px] text-on-surface-variant">Miryalaguda, Telangana • 10 Acres</p>
                  </div>
                </div>
                <span className="bg-surface-container-high text-secondary px-2 py-0.5 rounded text-[10px] font-bold">
                  Verified Buyer
                </span>
              </div>
              <div className="flex items-center gap-1 text-secondary text-xs">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[14px] fill">star</span>
                ))}
                <span className="text-on-surface-variant ml-2 text-[10px]">Harvested Nov 2024</span>
              </div>
              <p className="text-xs text-on-surface leading-relaxed">
                “Exceptional resistance to Bacterial Leaf Blight. In our canal zone, neighbouring non-hybrid plots caught leaf drying disease, but 6444 Gold stood completely lush green till grain hardening.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
