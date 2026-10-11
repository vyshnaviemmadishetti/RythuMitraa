import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string, param?: string) => void;
  onOpenScanner: () => void;
  onOpenVoice: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenScanner,
  onOpenVoice,
  searchQuery,
  onSearchChange
}) => {
  const {
    cartCount,
    wishlist,
    notifications,
    language,
    setLanguage,
    selectedMandal,
    setPincode,
    markNotificationAsRead
  } = useApp();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempPincode, setTempPincode] = useState('533437');
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPincode.length >= 6) {
      const mandalName =
        tempPincode === '533437'
          ? 'Peddapuram Village, 533437'
          : tempPincode.startsWith('533')
          ? `East Godavari Hub, ${tempPincode}`
          : `Kisan Hub Area, ${tempPincode}`;
      setPincode(tempPincode, mandalName);
      setShowLocationModal(false);
    }
  };

  const categories = [
    { id: 'seeds', label: 'Seeds (విత్తనాలు)', cat: 'seeds' },
    { id: 'fertilizers', label: 'Fertilizers (ఎరువులు)', cat: 'fertilizers' },
    { id: 'protection', label: 'Crop Protection (పురుగుమందులు)', cat: 'protection' },
    { id: 'irrigation', label: 'Irrigation (బిందు సేద్యం)', cat: 'irrigation' },
    { id: 'machinery', label: 'Farm Machinery (యంత్రాలు)', cat: 'machinery' },
    { id: 'organic', label: 'Organic Inputs (సేంద్రీయ)', cat: 'organic' },
    { id: 'cattle', label: 'Cattle Feed & Dairy', cat: 'cattle-feed' }
  ];

  const closeMenus = () => {
    setShowNotifMenu(false);
    setShowLangMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-container shadow-[0_1px_8px_rgba(0,0,0,0.12)]">
      <div className="h-28">
        {/* Main Header Bar (h-16) */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Location */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
              title="RythuMitra Home"
            >
              <div className="w-9 h-9 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold shadow-sm">
                <span className="material-symbols-outlined text-[24px]">agriculture</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg md:text-xl text-on-primary tracking-tight leading-none group-hover:text-secondary-fixed transition-colors">
                  RythuMitra
                </span>
                <span className="text-[10px] md:text-xs text-secondary-container leading-tight mt-0.5">
                  Farmer&apos;s Friend • రైతు మిత్ర
                </span>
              </div>
            </button>

            {/* Location Pill */}
            <div className="hidden xl:flex items-center gap-1 bg-primary/40 px-2.5 py-1 rounded text-on-primary text-xs">
              <span className="material-symbols-outlined text-secondary-fixed text-[18px]">location_on</span>
              <span className="text-on-primary-container truncate max-w-[150px] font-medium">
                {selectedMandal}
              </span>
              <button
                onClick={() => setShowLocationModal(true)}
                className="text-[11px] text-secondary-container hover:underline ml-1 font-bold cursor-pointer"
                type="button"
              >
                Change
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center bg-surface rounded-lg overflow-hidden">
            <span className="material-symbols-outlined text-outline px-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search seeds, fertilizers, machinery… (వెతకండి)"
              className="flex-1 py-2 text-sm bg-transparent outline-none text-on-surface"
            />
            <button
              type="button"
              onClick={onOpenScanner}
              className="px-2 text-primary hover:bg-surface-variant py-2"
              title="Scan crop / product"
            >
              <span className="material-symbols-outlined text-[22px]">photo_camera</span>
            </button>
            <button
              type="button"
              onClick={onOpenVoice}
              className="px-2 text-primary hover:bg-surface-variant py-2"
              title="Voice search"
            >
              <span className="material-symbols-outlined text-[22px]">mic</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0 text-on-primary">
            {/* Language */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowLangMenu((v) => !v);
                  setShowNotifMenu(false);
                }}
                className="p-2 rounded-full hover:bg-white/10 flex items-center gap-1 text-xs font-bold"
                title="Language"
              >
                <span className="material-symbols-outlined text-[22px]">translate</span>
                <span className="hidden sm:inline uppercase">{language}</span>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-surface text-on-surface rounded-lg shadow-lg overflow-hidden">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'te', label: 'తెలుగు' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code as typeof language);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-variant ${
                        language === l.code ? 'font-bold' : ''
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifMenu((v) => !v);
                  setShowLangMenu(false);
                }}
                className="relative p-2 rounded-full hover:bg-white/10"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-surface text-on-surface rounded-lg shadow-lg">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-outline">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`w-full text-left px-3 py-2 text-sm border-b border-outline-variant hover:bg-surface-variant ${
                          n.read ? 'opacity-60' : 'font-semibold'
                        }`}
                      >
                        {n.title ?? n.message}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => {
                closeMenus();
                onNavigate('wishlist');
              }}
              className="relative p-2 rounded-full hover:bg-white/10"
              title="Wishlist"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-secondary-container text-primary text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => {
                closeMenus();
                onNavigate('cart');
              }}
              className="relative p-2 rounded-full hover:bg-white/10"
              title="Cart"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-secondary-container text-primary text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search (below main bar) */}
        <div className="md:hidden px-4 pb-1 h-12 flex items-center">
          <div className="flex-1 flex items-center bg-surface rounded-lg overflow-hidden">
            <span className="material-symbols-outlined text-outline px-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products…"
              className="flex-1 py-2 text-sm bg-transparent outline-none text-on-surface"
            />
            <button type="button" onClick={onOpenScanner} className="px-2 text-primary">
              <span className="material-symbols-outlined text-[22px]">photo_camera</span>
            </button>
            <button type="button" onClick={onOpenVoice} className="px-2 text-primary">
              <span className="material-symbols-outlined text-[22px]">mic</span>
            </button>
          </div>
        </div>

        {/* Category Nav (h-12, desktop) */}
        <nav className="hidden md:block bg-primary/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-12 flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className={`whitespace-nowrap px-3 py-1.5 rounded text-xs font-bold text-on-primary hover:bg-white/10 transition-colors ${
                currentPath === 'catalog' ? 'bg-white/20' : ''
              }`}
            >
              All Products (మొత్తం)
            </button>
            {categories.map((c) => {
              const active = currentPath === `catalog-${c.cat}`;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onNavigate(`catalog-${c.cat}`)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded text-xs font-medium text-on-primary hover:bg-white/10 transition-colors ${
                    active ? 'bg-white/20 font-bold' : ''
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowLocationModal(false)}
        >
          <form
            onSubmit={handlePincodeSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface text-on-surface rounded-xl shadow-xl w-full max-w-sm p-5 space-y-4"
          >
            <h2 className="font-serif font-bold text-lg">Change Location (ప్రాంతం మార్చండి)</h2>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={tempPincode}
              onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit pincode"
              className="w-full border border-outline rounded-lg px-3 py-2 text-sm bg-transparent outline-none focus:border-primary"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 text-sm rounded-lg hover:bg-surface-variant"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={tempPincode.length < 6}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-bold disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};