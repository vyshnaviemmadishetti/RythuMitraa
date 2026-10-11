import React, { useState, useEffect } from 'react';
import { PRODUCTS, CROP_ADVISORIES } from '../data';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useApp } from '../context/AppContext';

interface HomePageProps {
  onProductSelect: (p: Product) => void;
  onOpenScanner: () => void;
  onOpenVoice: () => void;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onProductSelect,
  onOpenScanner,
  onOpenVoice,
  onNavigate
}) => {
  const { currentPincode, setPincode, showToast } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dealSeconds, setDealSeconds] = useState(5 * 3600 + 24 * 60 + 12);
  const [selectedCrop, setSelectedCrop] = useState<keyof typeof CROP_ADVISORIES>('paddy');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'seeds' | 'fertilizers' | 'protection' | 'irrigation'>('all');
  const [pincodeInput, setPincodeInput] = useState(currentPincode);

  // Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Deals countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setDealSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDealTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`;
  };

  const handlePincodeCheck = () => {
    if (pincodeInput.length >= 6) {
      setPincode(pincodeInput, `Peddapuram Rural, ${pincodeInput}`);
      showToast(`Pincode ${pincodeInput}: Express 24-hr tractor farm-gate delivery active!`, 'local_shipping');
    } else {
      showToast('Please enter a valid 6-digit village pincode', 'error');
    }
  };

  // Filter products for the main catalog section
  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeCategoryFilter === 'all') return true;
    return p.category === activeCategoryFilter;
  });

  const spotlightDeals = [
    PRODUCTS.find((p) => p.id === 'neptune-battery-sprayer-16l')!,
    PRODUCTS.find((p) => p.id === 'rallis-samrudhi-humic-98')!,
    PRODUCTS.find((p) => p.id === 'solar-light-trap-auto')!,
    PRODUCTS.find((p) => p.id === 'baif-chelated-mineral-mix-5kg')!
  ].filter(Boolean);

  const activeAdvisory = CROP_ADVISORIES[selectedCrop];

  return (
    <div className="flex flex-col w-full">
      {/* Top Notification Announcement Bar */}
      <div className="w-full bg-primary text-on-primary py-2 px-4 md:px-8 text-xs tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] bg-secondary-container text-on-secondary-fixed font-bold uppercase tracking-wider">
              Kharif Alert
            </span>
            <span className="text-surface-variant font-medium text-xs">
              Free Express Delivery on Certified Paddy Seeds & Bio-Fertilizers across AP & Telangana
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-surface-variant/90">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary-fixed">verified</span>
              ICAR Lab Certified
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary-fixed">credit_card</span>
              Kisan Credit Card (KCC) EMI Available
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full space-y-6 py-4">
        {/* 1. HERO CAROUSEL */}
        <section className="relative w-full overflow-hidden rounded-2xl bg-surface-container-low shadow-sm">
          <div className="relative w-full min-h-[380px] md:h-[350px] overflow-hidden select-none">
            {/* Slide 0: Paddy & Cotton */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 flex flex-col md:flex-row items-center justify-between p-6 md:p-10 bg-gradient-to-r from-primary to-primary-container text-on-primary ${
                currentSlide === 0 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none -z-10'
              }`}
            >
              <div className="flex-1 max-w-xl space-y-3 z-10">
                <div className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-fixed px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">local_florist</span>
                  Kharif 2025 Sowing Season Special
                </div>
                <h1 className="font-serif font-bold text-2xl md:text-4xl text-surface-container-lowest leading-tight">
                  Healthy Crops, Higher Yields 🌱
                </h1>
                <p className="text-xs md:text-sm text-primary-fixed-dim leading-relaxed">
                  Up to <span className="text-secondary-fixed font-bold text-sm md:text-base">45% OFF</span> on Certified Hybrid Paddy, Cotton & Chilli Seeds. Tested for 98% germination.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('products-catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="h-10 md:h-11 px-5 bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-bold text-xs md:text-sm rounded-lg shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>Shop Seeds Now</span>
                    <span className="material-symbols-outlined text-[18px]">east</span>
                  </button>
                  <button
                    onClick={onOpenScanner}
                    className="h-10 md:h-11 px-4 bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-on-primary font-bold text-xs md:text-sm rounded-lg backdrop-blur-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
                    <span>AI Leaf Scan</span>
                  </button>
                </div>
                <div className="text-[11px] text-surface-variant/80 flex items-center gap-1 pt-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary-fixed">bolt</span>
                  <span>ICAR & State University Approved • Doorstep Farm Delivery in 24-48 Hours</span>
                </div>
              </div>
              <div className="relative w-full md:w-5/12 h-44 md:h-full flex items-center justify-center mt-3 md:mt-0">
                <div className="w-full h-full max-h-[260px] rounded-xl overflow-hidden relative shadow-lg bg-primary/40">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWANhIyb24J3JZEzCKHoKi-LbnifvLm1D3VEMSoDZmN9l6zHdfCfNC_pSO1gQGA2lVB8z7n_xpkxOofCENrvlPHfaRoBWSk4izeV4-nkPEMfO7YYf9wb-SyZGhipsc9M9GfYN0XV-4AeKaESDqyAgj-_TciI49oGOXMNJBpJXENerfQq64PnjdQhxN-zB6YoIracThx0zATYM7n0xGwmkWVe1zuxRNzun2KlXgfdczNV0FfJ9AazCV"
                    alt="Farmer holding certified paddy seeds"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-3">
                    <span className="bg-primary/90 text-secondary-fixed px-2 py-0.5 rounded text-xs font-bold">
                      100% Germination Guarantee
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 1: AI Crop Doctor */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 flex flex-col md:flex-row items-center justify-between p-6 md:p-10 bg-gradient-to-r from-primary-container via-surface-tint to-primary text-on-primary ${
                currentSlide === 1 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none -z-10'
              }`}
            >
              <div className="flex-1 max-w-xl space-y-3 z-10">
                <div className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  Rythu AI Diagnosis • ₹0 Cost
                </div>
                <h2 className="font-serif font-bold text-2xl md:text-4xl text-surface-container-lowest leading-tight">
                  Detect Leaf Blight, Pests & Rot in 10s
                </h2>
                <p className="text-xs md:text-sm text-primary-fixed-dim leading-relaxed">
                  Snap a picture of your infested leaf. Our AI identifies bacterial blight, armyworms, or leaf spot and gives the exact chemical & organic dosage.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={onOpenScanner}
                    className="h-10 md:h-11 px-5 bg-surface-container-lowest text-primary font-bold text-xs md:text-sm rounded-lg shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer hover:bg-surface-variant"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">photo_camera</span>
                    <span>Scan Crop Leaf Now</span>
                  </button>
                  <button
                    onClick={onOpenVoice}
                    className="h-10 md:h-11 px-4 bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-on-primary font-bold text-xs md:text-sm rounded-lg backdrop-blur-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">mic</span>
                    <span>Ask in Telugu</span>
                  </button>
                </div>
                <div className="text-[11px] text-surface-variant/80 flex items-center gap-1 pt-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary-fixed">check_circle</span>
                  <span>Prescription available in Telugu, Kannada, Hindi and English</span>
                </div>
              </div>
              <div className="relative w-full md:w-5/12 h-44 md:h-full flex items-center justify-center mt-3 md:mt-0">
                <div className="w-full h-full max-h-[260px] rounded-xl overflow-hidden relative shadow-lg bg-primary/40">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvUD4SWXKbmTYVu6DGVd2E4jBzPd-3iwWCMhtV7EvmjEj0iGEnzBHEfAqtp5NNlMC6bQLxsM1SZjiKK0yf-iOngC1650Cvmru44blntinGm_md0saMBkcMknoAC0Fiua6q35aA5Wka5LhInG3AYYIqYKmkssF9ZeGLr9ozMVqjglaL24D4PunNp1bJxx-6hE6FgE6w9QXvgMOjEWSVG1Mt6vhpffPMt_weN7cs5i3QbGul7x1csGCt"
                    alt="Smartphone leaf scanner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-on-tertiary-container text-surface-container-lowest px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span> Bacterial Leaf Spot Detected
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Solar & Drip */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 flex flex-col md:flex-row items-center justify-between p-6 md:p-10 bg-gradient-to-r from-tertiary-container to-primary text-on-primary ${
                currentSlide === 2 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none -z-10'
              }`}
            >
              <div className="flex-1 max-w-xl space-y-3 z-10">
                <div className="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">solar_power</span>
                  PM-KUSUM Subsidy Approved
                </div>
                <h2 className="font-serif font-bold text-2xl md:text-4xl text-surface-container-lowest leading-tight">
                  Smart Solar Pumps & Drip Systems
                </h2>
                <p className="text-xs md:text-sm text-tertiary-fixed-dim leading-relaxed">
                  Save 60% water and reduce electricity bills to zero. Get complete 1-Acre to 5-Acre micro irrigation sets with free field technician setup.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('catalog-irrigation')}
                    className="h-10 md:h-11 px-5 bg-surface-container-lowest text-primary font-bold text-xs md:text-sm rounded-lg shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>Explore Irrigation Kits</span>
                    <span className="material-symbols-outlined text-[18px]">water_drop</span>
                  </button>
                </div>
              </div>
              <div className="relative w-full md:w-5/12 h-44 md:h-full flex items-center justify-center mt-3 md:mt-0">
                <div className="w-full h-full max-h-[260px] rounded-xl overflow-hidden relative shadow-lg">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHDU18GwFVgu4EiDx2CLZ1AhwRYiYnLD5fJaZrxIGXVOyQ7DozVRXYPkQ-7e1nK4DR9vfYh9FyH4diJ_ToKhLGq2qg3IBCrylYBttwiojUt3ZHiYavygs6d_kA1W_mqH2Uw_c76RaWDd4HpN_3lFARU48DcMGD_MsZ4vXpDMZj5bo5M80ZEk_xftJSzUIz4pughWUZrM9-9DwNECOx_VqJ5k19cHe5q2nOl6zFakX2uzsDqJEECDN6"
                    alt="Solar drip irrigation"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Slide 3: Fertilizer Stock */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 flex flex-col md:flex-row items-center justify-between p-6 md:p-10 bg-gradient-to-r from-primary to-surface-tint text-on-primary ${
                currentSlide === 3 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none -z-10'
              }`}
            >
              <div className="flex-1 max-w-xl space-y-3 z-10">
                <div className="inline-flex items-center gap-1 bg-on-tertiary-container text-surface-container-lowest px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                  Regulated Stock Live
                </div>
                <h2 className="font-serif font-bold text-2xl md:text-4xl text-surface-container-lowest leading-tight">
                  DAP, Urea & NPK 19:19:19 in Stock
                </h2>
                <p className="text-xs md:text-sm text-primary-fixed-dim leading-relaxed">
                  Direct from Coromandel, IFFCO & Nagarjuna at strictly regulated Central Government MRP. Free certified soil health test voucher with 5+ bags.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('catalog-fertilizers')}
                    className="h-10 md:h-11 px-5 bg-secondary-fixed text-on-secondary-fixed font-bold text-xs md:text-sm rounded-lg shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>Book Fertilizer Bags</span>
                    <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  </button>
                </div>
              </div>
              <div className="relative w-full md:w-5/12 h-44 md:h-full flex items-center justify-center mt-3 md:mt-0">
                <div className="w-full h-full max-h-[260px] rounded-xl overflow-hidden relative shadow-lg">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdGfAHPqJHV5sdmZOeVnOmfeCeirmKN06808Lu-0mOCp3DLkKGECwnyHgZXtU4VTlcBS07rjvQYXrWARxNOFPtrSY3qdVqA3xwjxYGOhNGwvDWbU_LzLuIny01-lmsv6sBZyxDVlVwpEadSpTHFTyEGOteN78cxqMkgmRP9cz42tN2AR-rL_yTQjuKXkZHL5v5qiqTE40upT32zjpmwAY0D0rGM1Q8K83i3J7aCeqwPjP0c7U1i9ui"
                    alt="Fertilizer bags"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-6 flex items-center gap-1.5 z-20">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-7 bg-surface-container-lowest' : 'w-2 bg-surface-container-lowest/50'
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="absolute bottom-3 right-6 flex items-center gap-2 z-20">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + 4) % 4)}
              className="w-8 h-8 rounded-full bg-primary/70 hover:bg-primary text-on-primary flex items-center justify-center transition-colors shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % 4)}
              className="w-8 h-8 rounded-full bg-primary/70 hover:bg-primary text-on-primary flex items-center justify-center transition-colors shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Quick Assurance Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-surface-container-lowest p-3 md:p-4 rounded-xl shadow-sm border border-surface-variant/30">
          <div className="flex items-center gap-2.5 p-2 rounded bg-surface-container-low/60">
            <div className="w-9 h-9 rounded bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <div>
              <h4 className="text-xs md:text-sm text-on-surface font-bold leading-tight">Express Farm Delivery</h4>
              <p className="text-[11px] text-on-surface-variant leading-tight">Direct to village gate in 24-48h</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded bg-surface-container-low/60">
            <div className="w-9 h-9 rounded bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">biotech</span>
            </div>
            <div>
              <h4 className="text-xs md:text-sm text-on-surface font-bold leading-tight">100% Lab Tested</h4>
              <p className="text-[11px] text-on-surface-variant leading-tight">Batch QR code traceability</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded bg-surface-container-low/60">
            <div className="w-9 h-9 rounded bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </div>
            <div>
              <h4 className="text-xs md:text-sm text-on-surface font-bold leading-tight">Agri-Doctor Support</h4>
              <p className="text-[11px] text-on-surface-variant leading-tight">Free call in Telugu/Hindi</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded bg-surface-container-low/60">
            <div className="w-9 h-9 rounded bg-surface-variant text-on-surface flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <div>
              <h4 className="text-xs md:text-sm text-on-surface font-bold leading-tight">Pay Cash or KCC</h4>
              <p className="text-[11px] text-on-surface-variant leading-tight">Pay after checking bag seal</p>
            </div>
          </div>
        </div>

        {/* 2. RYTHU SMART INNOVATIONS (Bento Box) */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Farmer Tech Tools</span>
              <h2 className="font-serif font-bold text-lg md:text-xl text-on-surface">Rythu Smart Innovations</h2>
            </div>
            <span className="text-xs text-on-surface-variant hidden sm:inline">Designed for field conditions with low connectivity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: AI Scanner */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-variant/30">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">document_scanner</span>
                </div>
                <div className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-secondary text-on-secondary font-bold uppercase">
                  AI Powered
                </div>
                <h3 className="font-serif font-bold text-base text-on-surface">Crop Disease Scanner</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Upload or snap a leaf photo to get instant diagnosis, disease name, and exact chemical cure in 10 seconds.
                </p>
              </div>
              <button
                onClick={onOpenScanner}
                className="mt-4 w-full h-10 bg-primary-container text-on-primary font-bold text-xs md:text-sm rounded flex items-center justify-center gap-1.5 hover:bg-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>Scan Crop Disease</span>
              </button>
            </div>

            {/* Card 2: Voice Assistant */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-variant/30">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">mic</span>
                </div>
                <div className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-tertiary-container text-on-tertiary-container font-bold uppercase">
                  రైతు వాణి • Voice
                </div>
                <h3 className="font-serif font-bold text-base text-on-surface">Rythu Voice Assistant</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Ask questions directly by voice in Telugu, Kannada, or Hindi. e.g., "వరిలో ఎండి తెగులుకి మందు ఏమిటి?"
                </p>
              </div>
              <button
                onClick={onOpenVoice}
                className="mt-4 w-full h-10 bg-surface-container-high hover:bg-surface-container text-on-surface font-bold text-xs md:text-sm rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary-container">record_voice_over</span>
                <span>Speak in Telugu / Eng</span>
              </button>
            </div>

            {/* Card 3: Govt Subsidy Pass */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-variant/30">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">verified</span>
                </div>
                <div className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-primary text-on-primary font-bold uppercase">
                  AP & TG Govt DBT
                </div>
                <h3 className="font-serif font-bold text-base text-on-surface">Govt Subsidy Pass</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Apply Rythu Bharosa / PM-KISAN subsidized vouchers directly on tarpaulins, sprayers, and seed bags.
                </p>
              </div>
              <button
                onClick={() => onNavigate('profile')}
                className="mt-4 w-full h-10 bg-surface-container-high hover:bg-surface-container text-on-surface font-bold text-xs md:text-sm rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Check Subsidies & Certs</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Card 4: Pincode Delivery Check */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-surface-variant/30">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-lg bg-surface-variant text-on-surface flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">agriculture</span>
                </div>
                <div className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-secondary-container text-on-secondary-fixed font-bold uppercase">
                  Tractor-Accessible
                </div>
                <h3 className="font-serif font-bold text-base text-on-surface">Check Farm Delivery</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Enter your village pincode to verify heavy farm-gate delivery time & nearest Rythu Hub depot.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter Pincode"
                  className="w-full h-10 px-2.5 text-xs bg-surface-container-low rounded focus:outline-none focus:bg-surface-container-lowest text-on-surface border border-outline-variant/30"
                />
                <button
                  type="button"
                  onClick={handlePincodeCheck}
                  className="h-10 px-3 bg-primary text-on-primary font-bold text-xs rounded shrink-0 hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Check
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DEALS OF THE DAY SPOTLIGHT */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-variant/30">
          <div className="bg-gradient-to-r from-primary-container via-primary to-primary-container p-4 text-on-primary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary-fixed text-[26px]">local_fire_department</span>
                <span className="font-serif font-bold text-lg md:text-xl text-surface-container-lowest">Deals of the Day</span>
                <span className="hidden md:inline text-xs text-secondary-container ml-1 font-bold">కిసాన్ ప్రత్యేక ఆఫర్లు</span>
              </div>
              {/* Live Countdown */}
              <div className="flex items-center gap-1 bg-primary/80 px-2.5 py-1 rounded text-surface-container-lowest font-mono font-bold text-xs">
                <span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim">timer</span>
                <span>{formatDealTime(dealSeconds)}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="text-xs font-bold text-secondary-container hover:text-secondary-fixed flex items-center gap-1 bg-surface-container-lowest/10 px-2.5 py-1 rounded cursor-pointer"
            >
              <span>View All 42 Deals</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 p-4 gap-4">
            {spotlightDeals.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onProductSelect(prod)}
                className="flex flex-col bg-surface-container-low/40 rounded-xl p-3 hover:bg-surface-container-low transition-colors group cursor-pointer border border-surface-variant/20"
              >
                <div className="w-full h-32 md:h-36 rounded-lg bg-surface-container-lowest overflow-hidden relative mb-2.5 flex items-center justify-center">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {prod.discountPercent}% OFF
                  </span>
                </div>
                <span className="text-[10px] font-bold text-secondary uppercase">{prod.category}</span>
                <h4 className="font-serif font-bold text-xs md:text-sm text-on-surface truncate mt-0.5">
                  {prod.name}
                </h4>
                <p className="text-[11px] text-on-surface-variant truncate">{prod.specification}</p>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="font-sans font-extrabold text-base text-primary">₹{prod.price}</span>
                  <span className="line-through text-xs text-outline">₹{prod.originalPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. CROP-WISE ADVISORY PILLS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Crop Specific Solutions</span>
              <h2 className="font-serif font-bold text-lg md:text-xl text-on-surface">Browse by Your Main Crop (మీ పంటను ఎంచుకోండి)</h2>
            </div>
            <span className="text-xs text-on-surface-variant hidden md:inline">Select a crop for custom spray chart & seed packages</span>
          </div>

          {/* Crop Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'paddy', emoji: '🌾', label: 'Paddy (వరి)' },
              { id: 'cotton', emoji: '☁️', label: 'Cotton (ప్రత్తి)' },
              { id: 'chilli', emoji: '🌶️', label: 'Chilli (మిరప)' },
              { id: 'maize', emoji: '🌽', label: 'Maize (మొక్కజొన్న)' },
              { id: 'tomato', emoji: '🍅', label: 'Tomato (టమాటా)' },
              { id: 'sugarcane', emoji: '🎋', label: 'Sugarcane (చెరకు)' },
              { id: 'mango', emoji: '🥭', label: 'Mango (మామిడి)' }
            ].map((crop) => {
              const isSelected = selectedCrop === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop.id as keyof typeof CROP_ADVISORIES)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface shadow-xs'
                  }`}
                >
                  <span>{crop.emoji}</span>
                  <span>{crop.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Advisory Box */}
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-outline-variant/30">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-secondary text-on-secondary uppercase">
                  {activeAdvisory.badge}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">East Godavari & Krishna Basin Alert</span>
              </div>
              <h3 className="font-serif font-bold text-sm md:text-base text-on-surface">
                {activeAdvisory.title}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
                {activeAdvisory.desc}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => onNavigate(`catalog-${activeAdvisory.filter}`)}
                className="flex-1 md:flex-initial h-10 px-4 bg-primary-container text-on-primary rounded-lg text-xs md:text-sm font-bold hover:bg-primary transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View {selectedCrop.toUpperCase()} Kit</span>
                <span className="material-symbols-outlined text-[16px]">shopping_cart_checkout</span>
              </button>
              <button
                onClick={onOpenVoice}
                className="h-10 px-3 bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                <span className="hidden sm:inline">Ask Agronomist</span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. VERIFIED PRODUCT CATALOG SECTION */}
        <section className="space-y-4" id="products-catalog-section">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Verified Agricultural Inputs</span>
              <h2 className="font-serif font-bold text-lg md:text-xl text-on-surface">Welcome to RythuMitra 🌱 Everything Your Farm Needs</h2>
              <p className="text-xs text-on-surface-variant">Curated based on your region (Andhra & Telangana Kharif) • High Demand Right Now</p>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'seeds', label: 'Seeds' },
                { id: 'fertilizers', label: 'Fertilizers' },
                { id: 'protection', label: 'Protection' },
                { id: 'irrigation', label: 'Irrigation' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id as any)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeCategoryFilter === cat.id
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onProductSelect}
              />
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('catalog')}
              className="px-6 py-2.5 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg text-xs md:text-sm font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Explore All 84 Products in Catalog</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* 6. RYTHU ASSURED (రైతు భరోసా) GUARANTEE & FARMER REVIEWS */}
        <section className="space-y-4">
          <div className="bg-surface-container-high rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-outline-variant/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md shrink-0">
                <span className="material-symbols-outlined text-[32px]">verified_user</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base md:text-lg text-primary">
                    Rythu Assured Guarantee (రైతు భరోసా)
                  </h3>
                  <span className="bg-primary text-on-primary text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                    100% Purity
                  </span>
                </div>
                <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
                  Never worry about spurious or fake seeds again. Every packet is lab certified, sealed, and traceable to manufacturer batch.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
              <div className="bg-surface-container-lowest p-2.5 rounded-lg text-center shadow-xs">
                <span className="font-extrabold text-base text-primary block font-sans">7 Days</span>
                <span className="text-[10px] text-on-surface-variant leading-tight block">Sprout Replacement</span>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded-lg text-center shadow-xs">
                <span className="font-extrabold text-base text-secondary block font-sans">100%</span>
                <span className="text-[10px] text-on-surface-variant leading-tight block">QR Traceable</span>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded-lg text-center shadow-xs">
                <span className="font-extrabold text-base text-tertiary-container block font-sans">Free</span>
                <span className="text-[10px] text-on-surface-variant leading-tight block">Doctor Advice</span>
              </div>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex gap-4 items-start border border-surface-variant/30">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-sm bg-surface-container">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU39rFhojcUjiTqenCDgSq6vuDXFu2JOTKhDJWdr25e40GklWCysz2-nWsnXmSvh4HYaJcdSJY9PLLkl93OZGEoFiW0EM4gol1soHZOXkVcR7NtGTPDd5sKtqODYEEpX8Q3M6GBkbSIKU115A-Zm-gq-SNXnsIYfkCnHKjlDd13r0WcWHiWqEb33l274twr4djiIsH9jIjDQKvyOCLgfOWs0q75oIkoEh1nzO3Hzg5kDekeqo8Hmus"
                  alt="M. Venkat Reddy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[15px] fill">star</span>
                  ))}
                  <span className="text-[11px] text-on-surface-variant font-medium ml-1">Verified Buyer</span>
                </div>
                <p className="text-xs md:text-sm text-on-surface italic leading-relaxed">
                  "Got genuine Teja chilli seeds delivered to my farm within 24 hours. Saved ₹3,000 compared to local mandi dealer, and 96% seeds germinated within 5 days!"
                </p>
                <div className="pt-1">
                  <strong className="text-xs text-primary block">M. Venkat Reddy</strong>
                  <span className="text-[11px] text-on-surface-variant">5 Acres Chilli & Cotton Farmer • Chilakaluripet, Guntur</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex gap-4 items-start border border-surface-variant/30">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-sm bg-surface-container">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEYftJR2_nnVazx4UK38AX16nDRsG13Iox0I5SRCNnEoiOfVncS29y0clDvWnRQ6cHzMAFmUC0oHK-w-WMWPLWEIKwhyWzyI4mn4uw0YfBPN4foGHDVpagKkZnRjdIBdswfNMAYXVctLvXMtHej4le3KnpBZZz2aZMrye4GifAcuZcKjYbjnYRlPmIyA2hEupCtrrljJuWVQ8QkZFX9jqA9m29AF8uD0gpn9nhwpNcAYSiDaqGwf0U"
                  alt="K. Lakshmi Devi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[15px] fill">star</span>
                  ))}
                  <span className="text-[11px] text-on-surface-variant font-medium ml-1">Verified Buyer</span>
                </div>
                <p className="text-xs md:text-sm text-on-surface italic leading-relaxed">
                  "The Telugu AI scanner diagnosed Yellow Vein Mosaic Virus in my bhindi and cotton in just 10 seconds. The recommended bio-spray reached my doorstep next morning."
                </p>
                <div className="pt-1">
                  <strong className="text-xs text-primary block">K. Lakshmi Devi</strong>
                  <span className="text-[11px] text-on-surface-variant">3.5 Acres Mixed Horticulture • Narsampet, Warangal</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
