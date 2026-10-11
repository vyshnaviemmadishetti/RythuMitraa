import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-surface-container-low mt-12 pb-20 md:pb-0">
      {/* Helpline Ribbon */}
      <div className="bg-surface-container-high py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">call</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Farmer Toll-Free Helpline
              </p>
              <a
                href="tel:18001801551"
                className="font-serif font-bold text-base md:text-lg text-primary hover:underline"
              >
                Kisan Call Centre 1800-180-1551
              </a>
            </div>
          </div>
          <div className="flex items-center gap-6 text-on-surface-variant text-xs md:text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
              <span>100% Genuine Agri-Inputs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[20px]">workspace_premium</span>
              <span>ICAR & State Agri-Univ Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Main Links */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-xs md:text-sm">
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-primary mb-1">Quick Categories</h4>
            <button
              onClick={() => onNavigate('catalog-seeds')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Certified Seeds (విత్తనాలు)
            </button>
            <button
              onClick={() => onNavigate('catalog-fertilizers')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Bio & NPK Fertilizers (ఎరువులు)
            </button>
            <button
              onClick={() => onNavigate('catalog-protection')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Crop Disease Control (పురుగుమందులు)
            </button>
            <button
              onClick={() => onNavigate('catalog-machinery')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Farm Implements (యంత్రాలు)
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-primary mb-1">Farmer Support</h4>
            <button
              onClick={() => onNavigate('scanner')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Crop Doctor AI Advisory
            </button>
            <button
              onClick={() => onNavigate('tracking')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Track Village Delivery
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Purity Replacement Policy
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Kisan Credit Card Pay
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-primary mb-1">Trust & Certifications</h4>
            <span className="text-on-surface-variant">AP Seeds Certification Agency</span>
            <span className="text-on-surface-variant">ISO 9001:2015 Seed Packaging</span>
            <span className="text-on-surface-variant">FSSAI Cattle Feed Standards</span>
            <span className="text-on-surface-variant">Zero Adulteration Seal Traceability</span>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-primary mb-1">Delivery Hub</h4>
            <span className="text-on-surface-variant">District Hub: East Godavari</span>
            <span className="text-on-surface-variant">Mandal: Peddapuram Rural</span>
            <span className="text-secondary font-bold">Doorstep Farm Delivery in 24-48 hrs</span>
            <span className="text-[11px] text-outline">Tractor & Mini-Van Reachable</span>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-variant/60 text-center text-xs text-on-surface-variant">
          © 2025 RythuMitra Agritech Private Limited. Empowering Indian Farmers with Pure Inputs.
        </div>
      </div>
    </footer>
  );
};
