/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './components/HomePage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { WishlistPage } from './components/WishlistPage';
import { TrackingPage } from './components/TrackingPage';
import { ProfilePage } from './components/ProfilePage';
import { CatalogPage } from './components/CatalogPage';
import { ScannerModal } from './components/ScannerModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { PRODUCTS } from './data';
import { Product } from './types';

// Every spelling of a category used anywhere in the app -> the one canonical id
// used in routes like "catalog-seeds". Keep this in sync with CatalogPage.
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

const MainApp: React.FC = () => {
  const { cartCount, wishlist, toastMessage, toastIcon } = useApp();

  // Navigation routing state
  const [currentPath, setCurrentPath] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleNavigate = (path: string, param?: string) => {
    scrollTop();

    const lower = path.toLowerCase();

    // 1) Category routes: "catalog-seeds", or a bare "seeds", or ("category", "seeds")
    const rawCategory = lower.startsWith('catalog-')
      ? lower.replace('catalog-', '')
      : lower === 'category' && param
      ? param.toLowerCase()
      : lower;

    if (CATEGORY_ALIASES[rawCategory] && (lower !== 'catalog')) {
      setSearchQuery(''); // a category click should show the whole category
      setCurrentPath(`catalog-${CATEGORY_ALIASES[rawCategory]}`);
      return;
    }

    // 2) "catalog" = all products
    if (lower === 'catalog') {
      setCurrentPath('catalog');
      return;
    }

    // 3) Product detail
    if (path === 'product' && param) {
      const prod = PRODUCTS.find((p) => p.id === param);
      if (prod) setSelectedProduct(prod);
      setCurrentPath('product');
      return;
    }

    // 4) Order tracking
    if (path === 'tracking') {
      if (param) setSelectedOrderId(param);
      setCurrentPath('tracking');
      return;
    }

    // 5) Modals (don't change the page)
    if (path === 'scanner') {
      setIsScannerOpen(true);
      return;
    }

    if (path === 'voice') {
      setIsVoiceOpen(true);
      return;
    }

    // 6) home, cart, wishlist, profile ...
    setCurrentPath(path);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPath('product');
    scrollTop();
  };

  // Typing in the header search box should always show results in the catalog
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length > 0 && currentPath !== 'catalog' && !currentPath.startsWith('catalog-')) {
      setCurrentPath('catalog');
    }
  };

  const isCatalogRoute = currentPath === 'catalog' || currentPath.startsWith('catalog-');

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased text-on-surface">
      {/* Top Header */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content Area (padding-top 112px to account for fixed 28-height header) */}
      <main className="w-full pt-28 pb-16 md:pb-0 flex-1">
        {currentPath === 'home' && (
          <HomePage
            onProductSelect={handleProductSelect}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenVoice={() => setIsVoiceOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === 'product' && (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={handleNavigate}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        )}

        {currentPath === 'cart' && (
          <CartPage onNavigate={handleNavigate} onProductSelect={handleProductSelect} />
        )}

        {currentPath === 'wishlist' && (
          <WishlistPage onNavigate={handleNavigate} onProductSelect={handleProductSelect} />
        )}

        {currentPath === 'tracking' && (
          <TrackingPage orderId={selectedOrderId} onNavigate={handleNavigate} />
        )}

        {currentPath === 'profile' && <ProfilePage onNavigate={handleNavigate} />}

        {isCatalogRoute && (
          <CatalogPage
            initialCategory={
              currentPath.startsWith('catalog-') ? currentPath.replace('catalog-', '') : undefined
            }
            searchQuery={searchQuery}
            onProductSelect={handleProductSelect}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenScanner={() => setIsScannerOpen(true)}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
      />

      {/* Leaf Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onProductSelect={handleProductSelect}
      />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onProductSelect={handleProductSelect}
        onNavigate={handleNavigate}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 transform transition-all duration-300 border border-surface-variant/20 animate-bounce-short">
          <span className="material-symbols-outlined text-secondary-fixed text-[22px]">
            {toastIcon}
          </span>
          <span className="text-xs md:text-sm font-bold font-sans">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}