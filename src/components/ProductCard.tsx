import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const isSaved = isInWishlist(product.id);

  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative group border border-surface-variant/30">
      {/* Top Tag & Wishlist Heart */}
      <div className="flex items-start justify-between absolute top-4 left-4 right-4 z-10 pointer-events-none">
        <div className="flex flex-col gap-1 items-start pointer-events-auto">
          <span className="bg-secondary text-on-secondary text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            {product.discountPercent}% OFF
          </span>
          {product.isSubsidized && (
            <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              Govt Subsidy
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`w-9 h-9 rounded-full bg-surface-container-lowest/95 backdrop-blur-sm shadow flex items-center justify-center transition-transform active:scale-90 pointer-events-auto cursor-pointer ${
            isSaved ? 'text-error' : 'text-on-surface-variant hover:text-error'
          }`}
          title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'fill' : ''}`}>
            favorite
          </span>
        </button>
      </div>

      {/* Product Image */}
      <div
        onClick={() => onSelect(product)}
        className="w-full h-48 md:h-52 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center mb-3 relative cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.badge && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-surface-container-lowest/95 px-2 py-0.5 rounded text-[10px] font-bold text-primary shadow">
            <span className="material-symbols-outlined text-[13px] text-secondary">verified</span>
            <span>{product.badge}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-secondary text-on-secondary text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              {product.rating} <span className="material-symbols-outlined text-[11px] fill">star</span>
            </span>
            <span className="text-[11px] text-on-surface-variant font-medium">
              ({product.reviewCount} reviews)
            </span>
            <span className="text-outline text-xs">•</span>
            <span className="text-[11px] font-bold text-secondary truncate max-w-[120px]">
              {product.brand}
            </span>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="font-serif font-bold text-sm md:text-base text-on-surface leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 space-y-2 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-lg md:text-xl text-on-surface font-sans">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="line-through text-xs text-outline font-medium">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-secondary">
              Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px] text-secondary">bolt</span>
            <span>
              Delivery: <strong className="text-on-surface">{product.deliveryTime}</strong>
            </span>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full h-10 md:h-11 bg-primary text-on-primary hover:bg-primary-container font-bold text-xs md:text-sm rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-98 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
