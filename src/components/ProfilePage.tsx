import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface ProfilePageProps {
  onNavigate: (path: string, param?: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { language, setLanguage, orders, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'kcc' | 'soil' | 'settings'>('orders');
  const [audioAdvisoryEnabled, setAudioAdvisoryEnabled] = useState(true);
  const [smsTeluguEnabled, setSmsTeluguEnabled] = useState(true);

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full space-y-6">
        {/* Profile Hero Card */}
        <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 md:p-8 relative overflow-hidden border border-surface-variant/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <img
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-sm ring-4 ring-primary/10"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBclTXWoxpUUc8pcrnQzBxzBNnTTA8mxkl3zdqRSi7Xmh81J0caMn3-Ez6sAOA0MuMYQNUihFOmQ5QcJyhphASklLHJfTe3H7PS3DjCEGzEPU3n-exVQCXzB8uNzCshqJczdxrIWhyln6A100_M8NEKN2Fru450L4zLWaWEbqR4zFoISi3CuX64Mt_iYyLisvtj4l1tSV8AdwCLdM7exwGBkdmT7Sb_Tea2tmA1K6p1_mrP0jAYuiLh"
                  alt="S. Venkat Reddy"
                />
                <span
                  className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary rounded-full p-1 shadow flex items-center justify-center"
                  title="Aadhaar & Land Patta Verified"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    రైతు ఖాతా • Verified Farmer
                  </span>
                  <span className="text-on-surface-variant text-[11px] font-mono">ID: AP-KCC-994821</span>
                </div>
                <h1 className="font-serif font-bold text-2xl md:text-3xl text-primary leading-tight">
                  S. Venkat Reddy <span className="text-on-surface font-normal text-lg">(వెంకట్ రెడ్డి)</span>
                </h1>
                <div className="flex items-center gap-1.5 text-on-surface-variant text-xs md:text-sm">
                  <span className="material-symbols-outlined text-secondary text-[18px]">agriculture</span>
                  <span>6.5 Acres Paddy & Chilli Cultivation • East Godavari District, Peddapuram Mandal</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 text-xs">
                  <span className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded text-primary font-bold">
                    <span className="material-symbols-outlined text-secondary text-[14px]">credit_card</span>
                    Verified KCC Holder
                  </span>
                  <span className="inline-flex items-center gap-1 bg-secondary-container/40 text-on-secondary-fixed-variant px-2.5 py-1 rounded font-bold">
                    <span className="material-symbols-outlined text-secondary text-[14px]">savings</span>
                    Rythu Bharosa Beneficiary
                  </span>
                  <span className="inline-flex items-center gap-1 bg-primary-container text-on-primary px-2.5 py-1 rounded font-bold">
                    <span className="material-symbols-outlined text-secondary-container text-[14px]">eco</span>
                    Organic Certified
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Balance Snapshot */}
            <div className="w-full md:w-auto bg-surface-container-low rounded-xl p-4 flex md:flex-col justify-around gap-4 shrink-0 text-xs border border-outline-variant/30">
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Available KCC Credit</span>
                <div className="font-sans font-extrabold text-xl md:text-2xl text-primary">₹1,50,000</div>
                <span className="text-[11px] text-secondary flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span> 4% Subsidized Crop Loan
                </span>
              </div>
              <div className="hidden md:block h-px bg-surface-variant w-full"></div>
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Govt Input Wallet</span>
                <div className="font-sans font-extrabold text-xl text-tertiary-container">₹2,000</div>
                <span className="text-[11px] text-on-surface-variant">Applicable on Rabi Seeds</span>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs md:text-sm">
          {[
            { id: 'orders', label: 'Orders & Inputs', icon: 'inventory_2' },
            { id: 'addresses', label: 'Farm Delivery Locations', icon: 'pin_drop' },
            { id: 'kcc', label: 'KCC & Subsidies', icon: 'account_balance_wallet' },
            { id: 'soil', label: 'Soil Health Card', icon: 'science' },
            { id: 'settings', label: 'Language & Voice', icon: 'record_voice_over' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Orders Panel */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif font-bold text-base md:text-lg text-primary">
                    ఇటీవలి ఆర్డర్లు • Recent Crop Input Orders ({orders.length})
                  </h2>
                </div>

                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-variant/30 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-variant/40 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary font-mono text-sm">#{ord.id}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.status === 'in_transit'
                                  ? 'bg-secondary text-on-secondary'
                                  : ord.status === 'delivered'
                                  ? 'bg-surface-container text-on-surface-variant'
                                  : 'bg-primary text-on-primary'
                              }`}
                            >
                              {ord.status === 'in_transit'
                                ? 'In Transit • మార్గంలో ఉంది'
                                : ord.status === 'delivered'
                                ? 'Delivered • అందినది'
                                : 'Confirmed'}
                            </span>
                          </div>
                          <span className="text-on-surface-variant text-[11px]">{ord.date}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-sans font-extrabold text-base text-primary">
                            ₹{ord.total.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-on-surface-variant block uppercase font-bold">
                            {ord.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-on-surface truncate pr-2">
                              • {it.quantity}x {it.productName}
                            </span>
                            <span className="font-bold text-primary shrink-0">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-surface-variant/40 text-xs">
                        <span className="text-on-surface-variant text-[11px]">
                          Delivery: {ord.deliveryAddress.village}
                        </span>
                        <button
                          onClick={() => onNavigate('tracking', ord.id)}
                          className="px-3 py-1.5 bg-primary-container text-on-primary rounded-lg font-bold hover:bg-primary transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Track Delivery</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Panel */}
            {activeTab === 'addresses' && (
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-variant/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif font-bold text-base md:text-lg text-primary">
                      డెలివరీ చిరునామాలు • Saved Farm & Gate Addresses
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      GPS-tagged points optimized for direct tractor, tempo, and bulk input transit
                    </p>
                  </div>
                  <button
                    onClick={() => showToast('New survey land parcel registered', 'add_location_alt')}
                    className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
                    <span>Add Parcel</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Farm Gate Address */}
                  <div className="bg-surface-container-low rounded-xl p-4 border border-secondary/40 space-y-2 relative">
                    <span className="absolute top-0 right-0 bg-secondary text-on-secondary px-2 py-0.5 rounded-bl text-[10px] font-bold">
                      PRIMARY / వ్యవసాయ క్షేత్రం
                    </span>
                    <h3 className="font-bold text-sm text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-[18px]">yard</span>
                      Farm Borewell Gate (Sy No. 44/2)
                    </h3>
                    <p className="text-on-surface leading-relaxed">
                      Survey No. 44/2, Near Venkat Reddy Borewell & Sub-station Road, Peddapuram Village, East Godavari - 533437.
                    </p>
                    <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between text-[11px]">
                      <span className="font-mono text-secondary font-bold">17.0289° N, 82.1384° E</span>
                      <span className="font-bold text-primary">12ft Tractor Access OK</span>
                    </div>
                  </div>

                  {/* Home Village Address */}
                  <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 space-y-2">
                    <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant">
                      Secondary / Home
                    </span>
                    <h3 className="font-bold text-sm text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[18px]">cottage</span>
                      Home Village Address (ఇంటి చిరునామా)
                    </h3>
                    <p className="text-on-surface leading-relaxed">
                      Door No. 3-84, Main Bazaar, Opposite Ramalayam Temple, Peddapuram Village, East Godavari - 533437.
                    </p>
                    <div className="bg-surface-container-low p-2 rounded text-[11px] text-on-surface-variant">
                      Primary Mobile: +91 99482 10982 • Two-Wheeler Access
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KCC Panel */}
            {activeTab === 'kcc' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-primary-container via-primary to-on-surface text-on-primary rounded-2xl p-6 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary-container text-[28px]">account_balance</span>
                      <div>
                        <h3 className="font-bold text-base text-on-primary">State Bank of India</h3>
                        <p className="text-[11px] text-on-primary-container">Peddapuram Agri Branch (IFSC: SBIN0001248)</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-xl text-secondary-fixed">KCC</span>
                  </div>

                  <div className="my-4">
                    <span className="text-[10px] uppercase tracking-wider text-on-primary-container block">
                      Kisan Credit Card Number
                    </span>
                    <span className="font-mono text-xl md:text-2xl tracking-widest text-on-primary">
                      •••• •••• •••• 9821
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2 border-t border-surface-variant/20">
                    <div>
                      <span className="text-on-primary-container text-[10px]">Available Credit Limit</span>
                      <span className="font-sans font-bold text-lg text-secondary-fixed block">₹1,50,000</span>
                    </div>
                    <div>
                      <span className="text-on-primary-container text-[10px]">Sanctioned Limit</span>
                      <span className="font-sans font-bold text-base text-on-primary block">₹3,00,000</span>
                    </div>
                    <div>
                      <span className="text-on-primary-container text-[10px]">Interest Rate</span>
                      <span className="text-secondary-container font-bold text-sm block">4.0% p.a. Prompt Pay</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-1.5">
                    <span className="font-bold text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-[18px]">savings</span>
                      Rythu Bharosa Subsidy Balance
                    </span>
                    <div className="font-sans font-extrabold text-2xl text-primary">₹2,000.00</div>
                    <p className="text-on-surface-variant leading-relaxed">
                      Usable at checkout for verified Hybrid Seeds, Micro-nutrients, and Bio-fungicides without card swipe.
                    </p>
                    <span className="text-secondary font-bold block pt-1">Validity: 31 March 2025</span>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-1.5">
                    <span className="font-bold text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-tertiary-container text-[18px]">receipt</span>
                      Seed Subsidy Quota (AP Seeds)
                    </span>
                    <div className="font-sans font-extrabold text-2xl text-tertiary">60 Kg Remaining</div>
                    <p className="text-on-surface-variant leading-relaxed">
                      Allocated for Kharif/Rabi cycle based on 6.5 Acres verified paddy land holding via Webland.
                    </p>
                    <span className="text-on-surface-variant block pt-1 font-mono">Quota ID: AP-SEED-24-551</span>
                  </div>
                </div>
              </div>
            )}

            {/* Soil Health Card */}
            {activeTab === 'soil' && (
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-variant/30 space-y-5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-primary/10 rounded-lg text-primary">
                      <span className="material-symbols-outlined text-[22px]">science</span>
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-base text-primary">భూసార పరీక్ష పత్రం (Soil Health Card)</h3>
                      <p className="text-on-surface-variant text-[11px]">Sample Plot: Field Block #2 (Tested Nov 2024)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Official ICAR Soil Health Certificate PDF downloaded', 'file_download_done')}
                    className="p-2 bg-surface-container text-primary rounded-lg hover:bg-surface-container-high cursor-pointer"
                    title="Download Soil Certificate"
                  >
                    <span className="material-symbols-outlined text-[20px]">file_download</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-surface-container-low p-3.5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-on-surface">Soil pH Value</span>
                      <span className="font-sans font-extrabold text-sm text-primary">6.8 (Optimal / అనుకూలం)</span>
                    </div>
                    <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-on-surface-variant">
                      <span>Acidic (4.5)</span>
                      <span>Neutral (7.0)</span>
                      <span>Alkaline (9.0)</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-3.5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-on-surface">Organic Carbon (OC)</span>
                      <span className="font-sans font-extrabold text-sm text-tertiary-container">0.54% (Moderate)</span>
                    </div>
                    <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                      <div className="bg-tertiary-container h-full rounded-full" style={{ width: '54%' }}></div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant">
                      Advisory: Apply Vermicompost 2 Tonnes/Acre before Rabi puddling.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings & Voice Dialect */}
            {activeTab === 'settings' && (
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-variant/30 space-y-4 text-xs">
                <h3 className="font-serif font-bold text-base text-primary">
                  భాష & వాయిస్ సెట్టింగులు (Language & Voice Settings)
                </h3>

                <div className="space-y-2">
                  <label className="font-bold text-on-surface block">App & Advisory Language:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setLanguage('te')}
                      className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                        language === 'te'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      తెలుగు (Telugu)
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                        language === 'en'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('hi')}
                      className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                        language === 'hi'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      हिन्दी (Hindi)
                    </button>
                  </div>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-primary block">Auto-read Advisory Audio</span>
                    <span className="text-[11px] text-on-surface-variant">
                      రైతు సలహాలు మరియు సూచనలను తెలుగులో వినిపించు (Spoken audio for warnings)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={audioAdvisoryEnabled}
                    onChange={(e) => setAudioAdvisoryEnabled(e.target.checked)}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-primary block">SMS Alerts in Telugu Script</span>
                    <span className="text-[11px] text-on-surface-variant">
                      Receive mandi market rates and tractor van status via SMS
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsTeluguEnabled}
                    onChange={(e) => setSmsTeluguEnabled(e.target.checked)}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Kisan Helpdesk & Emergency Toll Free */}
          <div className="lg:col-span-4 space-y-4 text-xs">
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-variant/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">support_agent</span>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                    Mandal Agri Officer Advisory
                  </span>
                  <h4 className="font-bold text-sm text-primary">Peddapuram Agritech Helpdesk</h4>
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Need urgent assistance with crop rot, fertilizer voucher booking, or tractor gate drop?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:18001801551"
                  className="py-2 px-2.5 rounded-lg bg-surface-container text-primary font-bold hover:bg-surface-container-high flex items-center justify-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>1800-180-1551</span>
                </a>
                <button
                  onClick={() => showToast('Connecting to WhatsApp Rythu Desk...', 'chat')}
                  className="py-2 px-2.5 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary-container flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 space-y-2">
              <span className="font-bold text-primary block">Account Trust Verification</span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Aadhaar card linked with PM-KISAN database. Certified land patta registered with East Godavari Revenue & Agriculture Board.
              </p>
              <button
                onClick={() => showToast('Farmer account state synchronized with village revenue passbook', 'verified')}
                className="w-full py-2 bg-surface-container-lowest text-primary rounded-lg font-bold hover:bg-surface-container cursor-pointer shadow-xs"
              >
                Sync Land Patta Passbook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
