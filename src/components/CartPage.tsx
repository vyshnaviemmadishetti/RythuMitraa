import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data';
import { Product } from '../types';

interface CartPageProps {
  onNavigate: (path: string, param?: string) => void;
  onProductSelect: (p: Product) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onProductSelect }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    addToCart,
    createOrder,
    showToast,
    selectedMandal
  } = useApp();

  const [voucherCode, setVoucherCode] = useState('KHARIF2025');
  const [voucherApplied, setVoucherApplied] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'kcc' | 'upi' | 'netbanking'>('cod');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Address inputs
  const [farmerName, setFarmerName] = useState('S. Venkat Reddy (రైతు)');
  const [surveyNumber, setSurveyNumber] = useState('Survey No. 44/2, Near Borewell & Sub-station Road');
  const [phoneNumber, setPhoneNumber] = useState('+91 99482 10982');

  const mrpTotal = cart.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const farmerRebate = mrpTotal - subtotal;
  const voucherDiscount = voucherApplied ? 200 : 0;
  const deliveryFee = 0; // Free kisan subsidy
  const grandTotal = Math.max(0, subtotal - voucherDiscount + deliveryFee);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (voucherCode.trim().toUpperCase() === 'KHARIF2025' || voucherCode.trim().toUpperCase() === 'RYTHU200') {
      setVoucherApplied(true);
      showToast('₹200 Village Farmer Subsidy code successfully applied! 🎉', 'verified');
    } else {
      showToast('Invalid voucher code. Try "KHARIF2025"', 'error');
    }
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty! Add products first.', 'error');
      return;
    }

    setIsCheckingOut(true);
    setTimeout(() => {
      const order = createOrder({
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image
        })),
        subtotal,
        subsidyDiscount: 0,
        voucherDiscount,
        deliveryFee,
        total: grandTotal,
        paymentMethod,
        status: 'confirmed',
        deliveryDate: 'Thursday, 16 Oct by 4:00 PM',
        deliveryAddress: {
          name: farmerName,
          surveyOrDoor: surveyNumber,
          village: 'Peddapuram Village',
          mandal: 'Peddapuram Rural',
          district: 'East Godavari',
          pincode: '533437',
          phone: phoneNumber
        }
      });
      setIsCheckingOut(false);
      showToast(`Order #${order.id} placed successfully! Doorstep farm delivery registered.`, 'local_shipping');
      onNavigate('tracking', order.id);
    }, 1200);
  };

  const addOnProducts = [
    {
      id: 'trichoderma-viride-1kg',
      name: 'Trichoderma Viride 1% WP (Bio-Shield)',
      price: 195,
      mrp: 260,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Rri2Qz7MCqTwZDL-ZfQvWg1zq-EZ8NGYzbzUbot1fcb9qBfSJONcLTX-izO7oquaP9Fich0lYXso9uL1kB6w6twbE33buuwZdm9Vo4tSm4JfXBG2bIzmK8LinAQFJmmRd7OgFw5qS_8xlAkQSqhpfnvrs9pEU663ZOEBDjePvCvnOp7a3kZzyqgzDiHrGvm5tXFpAC6e1fnYUwGyPLm0AtRkrt9VQZdR4xX22PM53UrW351HkPZ8',
      desc: 'Prevents sheath rot & root rot in paddy nursery. 1 kg pack.'
    },
    {
      id: 'carbendazim-50-wp-500g',
      name: 'Carbendazim 50% WP (Fungicide)',
      price: 240,
      mrp: 310,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9xIIQHaWA3ZQ0uyZfVrG5jYtKRaBuRx-3r-K2BxIBcUkrni_gTiO1M3irVbGvNOtCWUH9pCWy0yJHk_2hqtRTBqGImP5le3HikGke1VJKSlDrXDYPeYvv8uT3pyTNqJQ-0mp9_lybBSXJDd5NvbwB00QQn-HG2crHdntAH-hvA81404EZ0WJ55UD554-0Rzy2qTx9I7moa-FjkHt-NAsGuE6XKq0ymKqeGYZMsBpG_jV5rdPkXlsh',
      desc: 'Essential soaking treatment for Arize paddy seeds. 250g pack.'
    },
    {
      id: 'zinc-sulphate-33-5kg',
      name: 'Zinc Sulphate 33% (Khaira Disease Defense)',
      price: 380,
      mrp: 450,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYxH35VhWekJhNZLYAdmgezK8XEV6cVXqa5Nmblkk5vEMsNjXcbO_2EL2CcKuCaEoY8qMWRbVPYL1u_8l7xWbj05dgrxwtCx4_CPZW9vBhrm98zfrdACOC_WGFNq8wy4F3M1MC8icCI3Nay7gcfGmjrnKvWBcEscukXbl1A_PZ0yBhFRJuDqtciIcOCu8mt38opwa_2PDpJX6AWmRqTSQbkHLeeTJe63LmUn4FPfcz1fup5BV1qnMG',
      desc: 'Protects young nursery seedlings from soil zinc deficiency. 5 kg bag.'
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner & Checkout Stepper */}
      <div className="w-full bg-surface-container-low py-3 px-4 md:px-8 border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-secondary font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Rythu Certified Procurement • ఖరీఫ్ సీజన్ కొనుగోలు
            </div>
            <h1 className="font-serif font-bold text-xl md:text-2xl text-primary leading-tight mt-0.5">
              My Farming Cart <span className="text-on-surface-variant text-base font-normal font-sans">(నా బుట్ట • {cart.length} Items)</span>
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 md:gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-primary">
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs">
                1
              </div>
              <span>Cart Reviewing</span>
            </div>
            <div className="w-6 h-0.5 bg-outline-variant"></div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs">
                2
              </div>
              <span className="hidden sm:inline">Farm Gate Confirmed</span>
            </div>
            <div className="w-6 h-0.5 bg-outline-variant"></div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs">
                3
              </div>
              <span className="hidden sm:inline">Payment COD/KCC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
        {/* Address Delivery Strip */}
        <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 border border-outline-variant/30 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">agriculture</span>
            </div>
            <div>
              <span className="inline-block px-1.5 py-0.2 rounded text-[10px] bg-secondary text-on-secondary font-bold uppercase">
                Direct Farm Delivery
              </span>
              <p className="font-bold text-on-surface mt-0.5">
                Delivering to Farm Gate: <span className="text-primary">{farmerName}</span>, {surveyNumber}, {selectedMandal}
              </p>
            </div>
          </div>
          <button
            onClick={() => showToast('Enter new farm gate landmark below', 'pin_drop')}
            className="text-secondary font-bold hover:underline shrink-0 cursor-pointer"
          >
            Change Address
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-surface-container-lowest rounded-2xl p-10 text-center space-y-4 border border-surface-variant/40 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mx-auto">
              <span className="material-symbols-outlined text-[36px]">remove_shopping_cart</span>
            </div>
            <h2 className="font-serif font-bold text-lg text-primary">మీ బుట్ట ఖాళీగా ఉంది (Your Farm Cart is Empty)</h2>
            <p className="text-xs text-on-surface-variant">
              You haven't added any certified seeds, bio-fertilizers or farm equipment yet.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-lg hover:bg-primary-container transition-colors shadow cursor-pointer inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>Explore Certified Agri Catalog</span>
            </button>
          </div>
        ) : (
          /* Main 2-Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (8 cols): Items List, Addons */}
            <div className="lg:col-span-8 space-y-6">
              {/* Trust Guarantee Header */}
              <div className="bg-primary-container text-on-primary p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-[20px]">verified_user</span>
                  <span className="font-bold">100% Certified Direct Seed & Fertilizer Allotment</span>
                </div>
                <span className="bg-primary px-2 py-0.5 rounded text-[10px] text-primary-fixed font-bold font-mono">
                  Kharif Batch #AP-25
                </span>
              </div>

              {/* Items Card List */}
              <div className="space-y-3">
                {cart.map((item) => {
                  const p = item.product;
                  return (
                    <div
                      key={p.id}
                      className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-variant/40 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          onClick={() => onProductSelect(p)}
                          className="w-20 h-20 rounded-lg object-cover bg-surface-container-low shrink-0 cursor-pointer"
                        />
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="bg-secondary text-on-secondary text-[10px] font-bold px-1.5 py-0.2 rounded">
                              {p.discountPercent}% OFF
                            </span>
                            <span className="text-[11px] font-bold text-secondary truncate">
                              {p.brand}
                            </span>
                          </div>
                          <h3
                            onClick={() => onProductSelect(p)}
                            className="font-serif font-bold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer line-clamp-1"
                          >
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-on-surface-variant truncate">
                            {p.specification} • Pack: {item.selectedPack || p.packSize}
                          </p>
                          <div className="flex items-baseline gap-2 pt-0.5">
                            <span className="font-sans font-extrabold text-base text-primary">
                              ₹{p.price}
                            </span>
                            <span className="line-through text-xs text-outline font-medium">
                              ₹{p.originalPrice}
                            </span>
                            <span className="text-xs text-secondary font-bold">
                              Save ₹{p.originalPrice - p.price}/unit
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stepper and Remove Action */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-surface-variant/30">
                        <div className="flex items-center border border-outline-variant/40 rounded-lg bg-surface-container-low">
                          <button
                            onClick={() => updateCartQuantity(p.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="w-8 text-center font-bold text-xs font-sans text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(p.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="text-on-surface-variant hover:text-error flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">favorite_border</span>
                            <span className="hidden sm:inline">Save</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(p.id)}
                            className="text-error hover:underline flex items-center gap-1 cursor-pointer font-bold"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            <span>Remove</span>
                          </button>
                        </div>

                        <span className="font-sans font-bold text-xs text-on-surface block">
                          Subtotal: ₹{(p.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lab Tested Authenticity Ribbon */}
              <div className="bg-surface-container-low rounded-xl p-3.5 flex items-center justify-between border border-outline-variant/30 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[24px]">qr_code_scanner</span>
                  <div>
                    <strong className="text-primary block">100% Genuine Lab-Tested Guarantee</strong>
                    <span className="text-on-surface-variant text-[11px]">
                      Every bag features an ICAR/Directorate holographic security seal with verifiable batch QR.
                    </span>
                  </div>
                </div>
                <span className="bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold text-primary uppercase">
                  Open & Inspect OK
                </span>
              </div>

              {/* Kharif Advisory Essential Add-ons */}
              <div className="space-y-3 pt-2">
                <div>
                  <span className="text-[10px] font-bold bg-secondary text-on-secondary px-2 py-0.5 rounded uppercase">
                    Kharif Advisory Recommended
                  </span>
                  <h3 className="font-serif font-bold text-base text-primary mt-1">
                    Essential Add-ons for Kharif Paddy Season
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    University-certified bio-fungicides and seed treaters proven to protect nursery beds.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {addOnProducts.map((addon) => (
                    <div
                      key={addon.id}
                      className="bg-surface-container-lowest p-3 rounded-xl border border-surface-variant/30 flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <img
                          src={addon.image}
                          alt={addon.name}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        <h4 className="font-bold text-xs text-primary line-clamp-1">{addon.name}</h4>
                        <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                          {addon.desc}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between pt-1">
                        <div>
                          <span className="font-sans font-bold text-sm text-primary">₹{addon.price}</span>
                          <span className="line-through text-[11px] text-outline ml-1">₹{addon.mrp}</span>
                        </div>
                        <button
                          onClick={() => {
                            const found = PRODUCTS.find((p) => p.id === addon.id);
                            if (found) addToCart(found, 1);
                            else showToast(`Added ${addon.name} to Cart!`);
                          }}
                          className="px-2.5 py-1 bg-primary text-on-primary rounded text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Price Breakdown, Subsidy Voucher, Payment Choice */}
            <div className="lg:col-span-4 space-y-4">
              {/* Delivery Address Field Details */}
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-variant/30 space-y-2 text-xs">
                <span className="font-bold text-primary flex items-center gap-1 uppercase tracking-wider text-[11px]">
                  <span className="material-symbols-outlined text-[16px] text-secondary">pin_drop</span>
                  Farm Gate Handover Point
                </span>
                <div>
                  <label className="text-[11px] text-on-surface-variant block">Farmer Name:</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full px-2 py-1 bg-surface-container-low rounded border border-outline-variant/30 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-on-surface-variant block">Survey No / Landmark:</label>
                  <input
                    type="text"
                    value={surveyNumber}
                    onChange={(e) => setSurveyNumber(e.target.value)}
                    className="w-full px-2 py-1 bg-surface-container-low rounded border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-on-surface-variant block">Mobile Number:</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-2 py-1 bg-surface-container-low rounded border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>

              {/* Price Breakdown Card */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-variant/40 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-surface-variant/40">
                  <h3 className="font-serif font-bold text-base text-primary">Price Breakdown</h3>
                  <span className="bg-secondary-container text-on-secondary-fixed text-[10px] font-bold px-2 py-0.5 rounded">
                    Kharif Savings Applied
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Total Items Value (MRP)</span>
                    <span className="font-sans font-bold text-on-surface">₹{mrpTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-secondary font-bold">
                    <span>Farmer Subsidy & Rebate</span>
                    <span>-₹{farmerRebate.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Village Delivery Fee</span>
                    <span className="text-secondary font-bold">FREE (Peddapuram Hub)</span>
                  </div>
                  {voucherApplied && (
                    <div className="flex justify-between text-secondary font-bold">
                      <span>Rythu Bharosa / Kharif Voucher</span>
                      <span>-₹200</span>
                    </div>
                  )}
                </div>

                {/* Voucher Code Form */}
                <form onSubmit={handleApplyVoucher} className="pt-2 border-t border-surface-variant/40">
                  <label className="text-[11px] font-bold text-primary block mb-1">
                    Govt DBT / Rythu Bharosa Voucher:
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="e.g. KHARIF2025"
                      className="flex-1 px-2.5 py-1.5 bg-surface-container-low rounded text-xs font-mono font-bold uppercase focus:outline-none border border-outline-variant/30"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-primary text-on-primary rounded text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      {voucherApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {voucherApplied && (
                    <span className="text-[11px] text-secondary font-bold mt-1 block">
                      ✓ ₹200 Village Farmer Subsidy code successfully applied
                    </span>
                  )}
                </form>

                {/* Total Payable */}
                <div className="pt-3 border-t border-surface-variant/40 flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-xs text-primary block">Total Payable Amount</span>
                    <span className="text-[10px] text-outline">Inclusive of all agricultural GST</span>
                  </div>
                  <div className="text-right">
                    <span className="font-sans font-extrabold text-2xl text-primary block">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-secondary font-bold">
                      Total Farmer Savings: ₹{(farmerRebate + voucherDiscount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Payment Mode Selector */}
                <div className="pt-3 border-t border-surface-variant/40 space-y-2 text-xs">
                  <span className="font-bold text-on-surface block">Select Payment Preference:</span>

                  {/* COD */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5 font-bold text-primary'
                        : 'border-outline-variant/40 text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-primary"
                      />
                      <div>
                        <span>Pay After Seal Check (COD)</span>
                        <p className="text-[10px] text-on-surface-variant font-normal">
                          Inspect QR tag at farm gate before cash payment
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                  </label>

                  {/* KCC */}
                  <label
                    onClick={() => setPaymentMethod('kcc')}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      paymentMethod === 'kcc'
                        ? 'border-primary bg-primary/5 font-bold text-primary'
                        : 'border-outline-variant/40 text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={paymentMethod === 'kcc'}
                        onChange={() => setPaymentMethod('kcc')}
                        className="accent-primary"
                      />
                      <div>
                        <span>Kisan Credit Card (KCC RuPay)</span>
                        <p className="text-[10px] text-secondary font-semibold">
                          Zero-interest crop loan facility eligible
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  </label>

                  {/* UPI */}
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      paymentMethod === 'upi'
                        ? 'border-primary bg-primary/5 font-bold text-primary'
                        : 'border-outline-variant/40 text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="accent-primary"
                      />
                      <div>
                        <span>UPI (PhonePe / GPay / Paytm)</span>
                        <p className="text-[10px] text-on-surface-variant font-normal">
                          Instant receipt & automated SMS invoice
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">qr_code</span>
                  </label>
                </div>

                {/* Master Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isCheckingOut}
                  className="w-full h-12 bg-primary-container text-on-primary hover:bg-primary font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-surface border-t-transparent animate-spin"></div>
                      <span>Verifying Subsidy Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Place Order</span>
                      <span className="material-symbols-outlined text-[20px]">east</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-on-surface-variant flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">lock</span>
                  <span>Encrypted agri-procurement checkout</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
