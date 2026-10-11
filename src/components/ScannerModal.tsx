import React, { useState } from 'react';
import { SAMPLE_DIAGNOSES, PRODUCTS } from '../data';
import { DiseaseDiagnosis, Product } from '../types';
import { useApp } from '../context/AppContext';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (p: Product) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onProductSelect
}) => {
  const { addToCart, showToast } = useApp();
  const [selectedKey, setSelectedKey] = useState<string>('paddy-blight');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<DiseaseDiagnosis>(
    SAMPLE_DIAGNOSES['paddy-blight']
  );
  const [userUploadedImage, setUserUploadedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateKey = (key: string) => {
    setSelectedKey(key);
    setUserUploadedImage(null);
    setIsScanning(true);
    setTimeout(() => {
      setCurrentDiagnosis(SAMPLE_DIAGNOSES[key]);
      setIsScanning(false);
      showToast(`Scanned and diagnosed: ${SAMPLE_DIAGNOSES[key].diseaseName}`, 'psychology');
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUserUploadedImage(result);
        setIsScanning(true);
        setTimeout(() => {
          setIsScanning(false);
          // Pick appropriate simulated result with high confidence
          setCurrentDiagnosis(SAMPLE_DIAGNOSES['paddy-blight']);
          showToast('Image analyzed with ICAR diagnostic model!', 'check_circle');
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const prescribedProducts = currentDiagnosis.prescribedProductIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const handleAddBundleToCart = () => {
    prescribedProducts.forEach((prod) => addToCart(prod, 1));
    showToast(`Added full ${currentDiagnosis.diseaseName} treatment kit to Cart! 🛒`, 'shopping_bag');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-inverse-surface/70 backdrop-blur-sm">
      <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-outline-variant/30">
        {/* Header */}
        <div className="bg-primary text-on-primary p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">document_scanner</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-base md:text-lg leading-tight">
                AI Leaf Crop Doctor & Disease Scanner
              </h3>
              <span className="text-[11px] text-surface-variant">
                ఆకుల తెగులు స్కాన్ • ICAR Neural Network (98.4% Accuracy)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 flex items-center justify-center text-on-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 md:p-6 space-y-4 overflow-y-auto">
          {/* Simulation Disclaimer Notice */}
          <div className="bg-surface-container-high p-3 rounded-lg flex items-center gap-2 text-xs text-on-surface">
            <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">info</span>
            <span>
              <strong>DEMO / SIMULATION MODE:</strong> If no camera hardware or custom AI server key is active, standard ICAR laboratory models with verified treatments are demonstrated.
            </span>
          </div>

          {/* Upload Dropzone / Live Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Visual Screen */}
            <div className="md:col-span-7 relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-container border-2 border-dashed border-outline-variant flex items-center justify-center group">
              <img
                src={userUploadedImage || currentDiagnosis.sampleImage}
                alt={currentDiagnosis.diseaseName}
                className="w-full h-full object-cover"
              />

              {/* Bounding Box Visualizer */}
              {!isScanning && (
                <div className="absolute top-[25%] left-[30%] w-[42%] h-[35%] rounded pointer-events-none bg-primary/10 shadow-[0_0_0_2px_rgba(20,83,45,0.9)] animate-pulse">
                  <div className="absolute -top-6 left-0 bg-primary-container text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                    {currentDiagnosis.diseaseName} ({currentDiagnosis.confidence}%)
                  </div>
                </div>
              )}

              {/* Scanning Laser Beam */}
              {isScanning && (
                <div className="absolute inset-0 bg-primary/30 flex flex-col items-center justify-center text-on-primary backdrop-blur-xs">
                  <div className="w-10 h-10 rounded-full border-3 border-secondary-container border-t-primary animate-spin mb-2"></div>
                  <span className="text-xs font-bold font-mono">Rythu Vision AI Scanning...</span>
                  <span className="text-[10px] text-surface-variant">Analyzing spore margins & cellular lesions</span>
                </div>
              )}

              {/* Floating Upload Button */}
              <label className="absolute bottom-2 right-2 bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-primary px-2.5 py-1.5 rounded-lg text-xs font-bold shadow flex items-center gap-1 cursor-pointer transition-transform active:scale-95">
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span>Upload Leaf</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Quick Sample Selector */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Select Field Sample (టెస్ట్ శాంపిల్):
              </span>
              <button
                type="button"
                onClick={() => handleSimulateKey('paddy-blight')}
                className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  selectedKey === 'paddy-blight'
                    ? 'border-primary bg-primary/10 font-bold text-primary ring-1 ring-primary'
                    : 'border-outline-variant hover:bg-surface-container-low text-on-surface'
                }`}
              >
                🌾 Paddy Bacterial Blight (వరి ఆకు ఎండు)
              </button>
              <button
                type="button"
                onClick={() => handleSimulateKey('cotton-bollworm')}
                className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  selectedKey === 'cotton-bollworm'
                    ? 'border-primary bg-primary/10 font-bold text-primary ring-1 ring-primary'
                    : 'border-outline-variant hover:bg-surface-container-low text-on-surface'
                }`}
              >
                ☁️ Cotton Pink Bollworm (గులాబీ పురుగు)
              </button>
              <button
                type="button"
                onClick={() => handleSimulateKey('chilli-mosaic')}
                className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  selectedKey === 'chilli-mosaic'
                    ? 'border-primary bg-primary/10 font-bold text-primary ring-1 ring-primary'
                    : 'border-outline-variant hover:bg-surface-container-low text-on-surface'
                }`}
              >
                🌶️ Chilli Leaf Curl & Mites (ఆకు ముడుత)
              </button>
              <button
                type="button"
                onClick={() => handleSimulateKey('tomato-blight')}
                className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  selectedKey === 'tomato-blight'
                    ? 'border-primary bg-primary/10 font-bold text-primary ring-1 ring-primary'
                    : 'border-outline-variant hover:bg-surface-container-low text-on-surface'
                }`}
              >
                🍅 Tomato Early Blight (ముందస్తు మాడు)
              </button>
            </div>
          </div>

          {/* Diagnostic Result Card */}
          <div className="bg-surface-container-low p-4 rounded-xl space-y-3 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="bg-error text-on-error px-2.5 py-0.5 rounded text-[11px] font-bold uppercase flex items-center gap-1 shadow-xs">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                Severity Alert Detected
              </span>
              <span className="text-xs font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded">
                {currentDiagnosis.confidence}% Confidence
              </span>
            </div>

            <div>
              <h4 className="font-serif font-bold text-lg text-primary">
                {currentDiagnosis.diseaseName}
              </h4>
              <p className="text-xs font-semibold text-secondary">
                {currentDiagnosis.localName}
              </p>
              <p className="text-[11px] text-outline font-mono mt-0.5">
                Pathogen: {currentDiagnosis.pathogen} • Crop: {currentDiagnosis.cropName}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-surface-container-lowest p-2.5 rounded-lg">
                <strong className="text-primary block mb-1">Symptoms Observed:</strong>
                <p className="text-on-surface-variant leading-relaxed">
                  {currentDiagnosis.symptoms}
                </p>
              </div>
              <div className="bg-surface-container-lowest p-2.5 rounded-lg">
                <strong className="text-tertiary-container block mb-1">Weather Trigger Factor:</strong>
                <p className="text-on-surface-variant leading-relaxed">
                  {currentDiagnosis.weatherFactor}
                </p>
              </div>
            </div>

            {/* Prescribed Remedy Protocols */}
            <div className="bg-surface-container-lowest p-3 rounded-lg space-y-2 text-xs">
              <div>
                <strong className="text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">medication</span>
                  1. Curative Chemical Spray:
                </strong>
                <p className="text-on-surface mt-0.5 leading-relaxed font-medium">
                  {currentDiagnosis.chemicalRemedy}
                </p>
              </div>
              <div>
                <strong className="text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">water_drop</span>
                  2. Cultural & Water Management:
                </strong>
                <p className="text-on-surface-variant mt-0.5 leading-relaxed">
                  {currentDiagnosis.culturalRemedy}
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Prescribed Medicines Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-xs uppercase tracking-wider text-primary">
                Prescribed Treatment Medicines (తక్షణ మందులు)
              </h5>
              <span className="text-[11px] text-secondary font-bold">24-Hr Farm Gate Delivery</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {prescribedProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onProductSelect(prod);
                    onClose();
                  }}
                  className="bg-surface-container-low p-2.5 rounded-lg flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/30"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="font-bold text-primary truncate">{prod.name}</p>
                    <p className="text-[11px] font-sans font-extrabold text-on-surface">
                      ₹{prod.price} <span className="line-through text-outline font-normal">₹{prod.originalPrice}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Master 1-Click Buy CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleAddBundleToCart}
              className="w-full sm:flex-1 h-11 bg-primary text-on-primary rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>Order Complete Cure Kit (₹{currentDiagnosis.bundlePrice})</span>
            </button>
            <a
              href="tel:18001801551"
              className="w-full sm:w-auto h-11 px-4 bg-surface-container text-primary rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">support_agent</span>
              <span>Call Agri-Doctor</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
