import React from 'react';

interface BottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenScanner: () => void;
  cartCount: number;
  wishlistCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPath,
  onNavigate,
  onOpenScanner,
  cartCount,
  wishlistCount
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.06)] border-t border-surface-variant/40">
      <div className="flex items-center justify-around h-16 relative px-1">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentPath === 'home' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[11px] mt-0.5">Home</span>
        </button>

        {/* Categories / Catalog */}
        <button
          onClick={() => onNavigate('catalog')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentPath.startsWith('catalog') ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">category</span>
          <span className="text-[11px] mt-0.5">Catalog</span>
        </button>

        {/* Central Prominent AI Scan Button */}
        <div className="flex flex-col items-center justify-center flex-1 relative -top-3">
          <button
            onClick={onOpenScanner}
            className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform ring-4 ring-surface cursor-pointer"
            title="Scan Crop Disease"
          >
            <span className="material-symbols-outlined text-[26px]">document_scanner</span>
          </button>
          <span className="text-[10px] text-primary font-bold mt-1">AI Scan</span>
        </div>

        {/* Wishlist */}
        <button
          onClick={() => onNavigate('wishlist')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative cursor-pointer ${
            currentPath === 'wishlist' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">favorite</span>
          {wishlistCount > 0 && (
            <span className="absolute top-1 right-3 bg-secondary text-on-secondary font-bold text-[9px] px-1 rounded-full">
              {wishlistCount}
            </span>
          )}
          <span className="text-[11px] mt-0.5">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onNavigate('cart')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative cursor-pointer ${
            currentPath === 'cart' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-3 bg-secondary-container text-on-secondary-fixed font-bold text-[9px] px-1 rounded-full">
              {cartCount}
            </span>
          )}
          <span className="text-[11px] mt-0.5">Cart</span>
        </button>
      </div>
    </div>
  );
};
