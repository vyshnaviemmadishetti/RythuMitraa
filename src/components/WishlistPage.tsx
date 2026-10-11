import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data';
import { Product } from '../types';

interface WishlistPageProps {
  onNavigate: (path: string) => void;
  onProductSelect: (p: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate, onProductSelect }) => {
  const {
    wishlist,
    removeFromCart,
    toggleWishlist,
    moveToCartFromWishlist,
    moveAllWishlistToCart,
    showToast
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<'all' | 'seeds' | 'pesticides' | 'machinery' | 'subsidized'>('all');

  const wishlistProducts = wishlist
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const filteredProducts = wishlistProducts.filter((p) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'seeds') return p.category === 'seeds';
    if (filterCategory === 'pesticides') return p.category === 'protection' || p.category === 'organic';
    if (filterCategory === 'machinery') return p.category === 'machinery' || p.category === 'irrigation';
    if (filterCategory === 'subsidized') return p.isSubsidized;
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-on-surface-variant text-xs mb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors cursor-pointer">
            హోమ్ (Home)
          </button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <button onClick={() => onNavigate('profile')} className="hover:text-primary transition-colors cursor-pointer">
            రైతు ఖాతా (Farmer Account)
          </button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">ఇష్టాల జాబితా (Wishlist)</span>
        </nav>

        {/* Title Header Section */}
        <div className="bg-surface-container-lowest p-5 md:p-8 rounded-2xl shadow-sm mb-6 border border-surface-variant/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center p-1 bg-primary/10 rounded-full text-primary">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-secondary font-bold">
                  ఖరీఫ్ సీజన్ పొదుపు • Kharif 2025 Planner
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl md:text-3xl text-primary tracking-tight">
                My Farm Wishlist{' '}
                <span className="text-on-surface-variant text-base md:text-lg font-normal font-sans">
                  (రైతు ఇష్టాల జాబితా • {wishlist.length} Saved Items)
                </span>
              </h1>
              <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                Saved certified inputs for East Godavari (Peddapuram Hub). Direct-to-farm dispatch ready.
              </p>
            </div>

            {/* Bulk Action Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={moveAllWishlistToCart}
                disabled={wishlist.length === 0}
                className="flex items-center justify-center gap-2 h-11 px-5 bg-primary text-on-primary font-bold text-xs md:text-sm rounded-lg shadow-sm hover:bg-primary-container active:scale-98 transition-all cursor-pointer disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                <span>Move All In-Stock Items to Cart</span>
              </button>
              <button
                onClick={() => onNavigate('cart')}
                className="flex items-center justify-center gap-1.5 h-11 px-4 bg-surface-container text-on-surface font-bold text-xs md:text-sm rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>View Cart</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pt-4 mt-2 border-t border-surface-variant/30 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              All Items ({wishlist.length})
            </button>
            <button
              onClick={() => setFilterCategory('seeds')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                filterCategory === 'seeds'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              Seeds (విత్తనాలు)
            </button>
            <button
              onClick={() => setFilterCategory('pesticides')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                filterCategory === 'pesticides'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              Pesticides & Bio (సేంద్రీయ)
            </button>
            <button
              onClick={() => setFilterCategory('machinery')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                filterCategory === 'machinery'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              Machinery & Tools (యంత్రాలు)
            </button>
            <button
              onClick={() => setFilterCategory('subsidized')}
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer ${
                filterCategory === 'subsidized'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'bg-secondary-container/40 text-on-secondary-fixed hover:bg-secondary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Subsidized (సబ్సిడీ అర్హత)</span>
            </button>
          </div>
        </div>

        {/* Seasonal Advisory Callout */}
        <div className="bg-tertiary-fixed text-on-tertiary-fixed p-4 md:p-5 rounded-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-tertiary text-[26px] shrink-0 mt-0.5">info</span>
            <div>
              <h2 className="font-bold text-xs md:text-sm text-tertiary">రైతు సూచన (Agricultural Season Advisory):</h2>
              <p className="text-xs text-on-tertiary-fixed-variant mt-0.5 leading-relaxed">
                Prices and state government subsidy quotas fluctuate based on current Kharif demand. Lock in preferential village cooperative rates by transferring items to your cart before midnight.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 bg-tertiary text-on-tertiary text-[10px] rounded uppercase font-bold tracking-wider shrink-0">
            Quota Closes in 48h
          </span>
        </div>

        {/* Saved Supplies Grid */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant/30">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
              <span className="material-symbols-outlined text-[36px]">heart_broken</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-primary mb-1">
              మీ ఇష్టాల జాబితా ఖాళీగా ఉంది (Your Farm Wishlist is Empty)
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md mb-4 leading-relaxed">
              Explore verified certified seeds, drip setups, and organic fertilizers to save them for later!
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-lg hover:bg-primary-container transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>Explore Seeds & Fertilizers</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative group border border-surface-variant/30"
              >
                {/* Image Canvas */}
                <div
                  onClick={() => onProductSelect(product)}
                  className="relative w-full h-44 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center mb-3 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    <span className="bg-secondary text-on-secondary px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {product.discountPercent}% OFF
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/90 hover:bg-error hover:text-on-error text-outline transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete_outline</span>
                  </button>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap items-center gap-1 mb-1.5">
                  {product.isSubsidized && (
                    <span className="bg-secondary-container/40 text-on-secondary-fixed text-[10px] px-1.5 py-0.2 rounded font-bold">
                      Govt Subsidy Eligible
                    </span>
                  )}
                  <span className="bg-surface-container text-on-surface-variant text-[10px] px-1.5 py-0.2 rounded">
                    {product.packSize}
                  </span>
                </div>

                <h3
                  onClick={() => onProductSelect(product)}
                  className="font-serif font-bold text-xs md:text-sm text-on-surface mb-1 line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                >
                  {product.name}
                </h3>
                <p className="text-[11px] text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Availability */}
                <div className="flex items-center gap-1 text-secondary text-[11px] font-bold mb-3">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>In Stock • Ready for Peddapuram Hub</span>
                </div>

                {/* Price Row */}
                <div className="mt-auto pt-2 border-t border-surface-variant/30 space-y-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-sans font-extrabold text-base text-on-surface">
                      ₹{product.price}
                    </span>
                    <span className="text-[11px] text-outline line-through">₹{product.originalPrice}</span>
                    <span className="text-[11px] text-secondary font-bold ml-auto">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => moveToCartFromWishlist(product.id)}
                      className="w-full h-10 bg-primary text-on-primary font-bold text-xs rounded hover:bg-primary-container active:scale-98 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                      <span>Move to Cart</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="w-full py-1 text-on-surface-variant hover:text-error text-[11px] text-center transition-colors cursor-pointer"
                    >
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Protection Reassurance Strip */}
        <div className="mt-8 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">lock</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-primary mb-0.5">Price Guarantee</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  Wishlist alerts monitor mandi and factory supply prices daily so you never overpay for seasonal inputs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">local_shipping</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-primary mb-0.5">Doorstep Field Delivery</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  Direct mini-truck delivery right up to your village borewell or storage shed with Cash-on-Delivery option.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">support_agent</span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-primary mb-0.5">Free Agri-Doctor Consultation</h4>
                <p className="text-on-surface-variant leading-relaxed">
                  Every wishlist purchase includes free telephonic advisory from Telugu agricultural university scientists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
