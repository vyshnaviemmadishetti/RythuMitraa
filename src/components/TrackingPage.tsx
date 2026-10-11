import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface TrackingPageProps {
  orderId?: string;
  onNavigate: (path: string) => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({ orderId, onNavigate }) => {
  const { orders, showToast } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orderId || (orders.length > 0 ? orders[0].id : 'RM-2025-88421')
  );

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleSendLandmarkSms = () => {
    showToast(`Landmark SMS instructions sent to Driver Ramesh Naidu: "Survey No. 142/B near Borewell"`, 'sms');
  };

  const handleDownloadCert = () => {
    showToast('Batch #AP-2025-BG64 Lab QC Germination Certificate generated (PDF)', 'file_download_done');
  };

  if (!activeOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="font-serif font-bold text-xl text-primary">No orders placed yet.</h2>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 text-xs">
          <nav className="flex items-center gap-1.5 text-on-surface-variant">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors cursor-pointer">
              Home
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <button onClick={() => onNavigate('profile')} className="hover:text-primary transition-colors cursor-pointer">
              Kisan Account
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">#{activeOrder.id}</span>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold rounded shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Receipt</span>
            </button>
            <button
              onClick={handleDownloadCert}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-primary text-on-primary hover:bg-primary-container font-bold rounded shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Download Lab & QC Certificate</span>
            </button>
          </div>
        </div>

        {/* Order Selector Tab if multiple orders */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 text-xs">
            <span className="font-bold text-on-surface-variant shrink-0">Select Order:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOrderId(o.id)}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                  activeOrder.id === o.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                #{o.id} ({o.status === 'delivered' ? 'Delivered' : 'In Transit'})
              </button>
            ))}
          </div>
        )}

        {/* Editorial Page Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-fixed rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            <span>Active Dispatch Route • East Godavari Farm Corridor</span>
          </div>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-primary tracking-tight">
            Order Details & Farm-Gate Tracking
          </h1>
          <p className="font-serif italic text-xs md:text-sm text-on-surface-variant mt-0.5">
            ఆర్డర్ వివరాలు & డెలివరీ ట్రాకింగ్ • East Godavari Farm Corridor
          </p>
        </div>

        {/* Main Grid: Left Timeline & Items, Right Driver & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Order Reference Pill */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 md:p-6 border border-surface-variant/30 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-low p-4 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Order Reference</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-bold text-sm text-primary font-mono">#{activeOrder.id}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeOrder.id);
                        showToast('Order ID copied to clipboard');
                      }}
                      className="text-outline hover:text-primary cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Placed On</span>
                  <span className="font-bold text-xs text-on-surface block mt-0.5">{activeOrder.date}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Payment Mode</span>
                  <span className="font-bold text-xs text-secondary flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    {activeOrder.paymentMethod.toUpperCase()} (Farm Gate)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Payable Amount</span>
                  <span className="font-sans font-extrabold text-base text-primary block mt-0.5">
                    ₹{activeOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              <div className="flex items-start gap-3 bg-primary-container text-on-primary p-4 rounded-xl shadow-xs">
                <div className="w-11 h-11 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[24px]">agriculture</span>
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-secondary-container font-bold uppercase tracking-wider text-[11px]">
                      Estimated Farm Handover
                    </span>
                    <span className="bg-primary px-2 py-0.5 rounded text-[10px] font-bold text-on-primary">
                      On Schedule
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-on-primary mt-0.5">
                    {activeOrder.deliveryDate}
                  </h3>
                  <p className="text-on-primary-container mt-0.5 leading-relaxed">
                    Direct village delivery to {activeOrder.deliveryAddress.village} ({activeOrder.deliveryAddress.pincode}). Pay only after inspecting tamper-evident green seal.
                  </p>
                </div>
              </div>
            </div>

            {/* Consignment Milestones Timeline */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 md:p-6 border border-surface-variant/30 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-lg text-primary">Consignment Milestones</h2>
                  <p className="text-xs text-on-surface-variant">
                    Live audit trail with verified lab credentials and vehicle GPS tags
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-surface-container-high text-primary font-bold text-xs rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                  <span>Live Tracking</span>
                </span>
              </div>

              {/* Vertical Steps */}
              <div className="relative pl-6 md:pl-8 space-y-6">
                <div className="absolute top-4 bottom-4 left-[23px] md:left-[31px] w-1 bg-surface-variant -z-0"></div>
                <div className="absolute top-4 h-[65%] left-[23px] md:left-[31px] w-1 bg-secondary -z-0"></div>

                {/* Step 1 */}
                <div className="relative flex items-start gap-3 z-10">
                  <div className="-ml-6 md:-ml-8 w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow shrink-0">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <div className="flex-1 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-primary">1. Order Placed & Seed Quota Allocated</h3>
                      <span className="text-on-surface-variant text-[11px]">Today, 09:30 AM</span>
                    </div>
                    <p className="text-on-surface-variant">
                      Requisition booked through RythuMitra Portal. Subsidy clearance token registered with East Godavari Agriculture Board.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-3 z-10">
                  <div className="-ml-6 md:-ml-8 w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow shrink-0">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                  </div>
                  <div className="flex-1 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-primary">2. Batch Certified & QC Sealed</h3>
                        <span className="bg-secondary-fixed text-on-secondary-fixed font-bold text-[10px] px-1.5 py-0.2 rounded">
                          Passed 98.4% Purity
                        </span>
                      </div>
                      <span className="text-on-surface-variant text-[11px]">Today, 02:15 PM</span>
                    </div>
                    <p className="text-on-surface-variant">
                      Verified at East Godavari Agro Hub Central Depot. Moisture tested &lt; 11.2%. Hologram tamper band applied.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start gap-3 z-10">
                  <div className="-ml-6 md:-ml-8 w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow ring-4 ring-secondary-container shrink-0">
                    <span className="material-symbols-outlined text-[18px] animate-pulse">local_shipping</span>
                  </div>
                  <div className="flex-1 bg-surface-container-high p-4 rounded-xl border border-secondary/40 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-primary">3. Dispatched in Delivery Van (In Transit)</h3>
                        <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                          On Way
                        </span>
                      </div>
                      <span className="text-primary font-bold">Tomorrow 8:00 AM</span>
                    </div>
                    <p className="text-on-surface">
                      En route from Kakinada Regional Warehouse towards Peddapuram Mandal Hub. Temperature-controlled dry bed transit vehicle.
                    </p>
                    {/* Mini Progress */}
                    <div className="bg-surface-container-lowest p-2 rounded text-[11px]">
                      <div className="flex justify-between text-on-surface-variant mb-1">
                        <span>Kakinada Warehouse</span>
                        <span className="text-primary font-bold">Samalkot Junction (Current)</span>
                        <span>Peddapuram Depot</span>
                      </div>
                      <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-start gap-3 z-10">
                  <div className="-ml-6 md:-ml-8 w-8 h-8 rounded-full bg-surface-dim text-on-surface-variant flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">home_work</span>
                  </div>
                  <div className="flex-1 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 text-xs opacity-85">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-on-surface">4. Farm-Gate Handover & Seal Inspection</h3>
                      <span className="text-on-surface-variant text-[11px]">Thu, 16 Oct by 4:00 PM</span>
                    </div>
                    <p className="text-on-surface-variant mt-0.5">
                      Agent will deliver directly to your farm perimeter. Inspect the green seal before cash handover or UPI QR scan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Contents Breakdown */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 md:p-6 border border-surface-variant/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-lg text-primary">
                    Package Contents ({activeOrder.items.length} Items)
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Batch-verified genuine input products ready for farm deployment
                  </p>
                </div>
                <span className="text-xs font-mono text-outline">Batch Seal: #AP-2025-BG64</span>
              </div>

              <div className="divide-y divide-surface-variant/50">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-14 h-14 rounded-lg object-cover bg-surface-container shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-primary line-clamp-1">{item.productName}</h4>
                        <p className="text-on-surface-variant text-[11px]">
                          Quantity: {item.quantity} Bags • Verified Stock
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-sans font-bold text-sm text-primary">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="pt-3 border-t border-surface-variant/40 space-y-1.5 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal:</span>
                  <span className="font-bold font-sans">₹{activeOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {activeOrder.voucherDiscount > 0 && (
                  <div className="flex justify-between text-secondary font-bold">
                    <span>Rythu Farmer Voucher:</span>
                    <span>-₹{activeOrder.voucherDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface-variant">
                  <span>Farm Gate Village Direct Delivery:</span>
                  <span className="text-secondary font-bold">FREE (Kisan Subsidy)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-surface-variant/40">
                  <span>Total Payable at Gate:</span>
                  <span className="font-sans text-lg">₹{activeOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Driver Contact & Farm Map */}
          <div className="lg:col-span-4 space-y-6">
            {/* Assigned Driver Card */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 border border-surface-variant/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">
                  Assigned Field Officer
                </span>
                <span className="text-secondary font-bold text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Verified Agent
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7HRYx2_vH8VKKBoo4qn6UPzw_wVoIU17aNOWHXtGsrsX5frDAmqfkVxOJamhDjG_tRKIHdh9Zj_M-38tHjaJZCaWdZxSCjjtAf7y2y12s_FsnTHdY4ylCNL8qY32EAHBNsQYzmMLbiWiJ4_5LFqzZU0dXnU1ewwGmJHe6oNbTjBB8ZkeukY2mrzbgMRUx1ubh2rd0w-WwVXm6kaXuIFomyLJFJlhPmEpqy_x42F4AfckqmdLfmsNL"
                  alt="Ramesh Naidu"
                  className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-primary/20"
                />
                <div className="text-xs">
                  <h3 className="font-serif font-bold text-sm text-primary">{activeOrder.agentName || 'Ramesh Naidu'}</h3>
                  <p className="text-on-surface-variant">Tractor & Small Van Logistics</p>
                  <div className="flex items-center gap-1 text-secondary mt-0.5">
                    <span className="material-symbols-outlined text-[14px] fill">star</span>
                    <strong className="text-on-surface">4.9</strong> (1,240 farm drop-offs)
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-2.5 rounded-lg text-xs space-y-0.5">
                <p className="font-semibold text-primary">Vehicle: Mahindra Bolero Maxi Truck</p>
                <p className="text-on-surface-variant text-[11px]">Reg: AP-05-TX-4482 (Tarpaulin Covered)</p>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:${activeOrder.agentPhone || '+919848012345'}`}
                  className="w-full h-11 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Call Driver ({activeOrder.agentPhone || '+91 98480 12345'})</span>
                </a>
                <button
                  type="button"
                  onClick={handleSendLandmarkSms}
                  className="w-full h-10 bg-surface-container text-primary hover:bg-surface-container-high rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">sms</span>
                  <span>Send Field Gate Landmark (SMS)</span>
                </button>
              </div>
            </div>

            {/* Farm Delivery Address */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-5 border border-surface-variant/30 space-y-3 text-xs">
              <h3 className="font-serif font-bold text-sm text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">pin_drop</span>
                <span>Farm Delivery Address</span>
              </h3>
              <div className="bg-surface-container-low p-3 rounded-lg leading-relaxed space-y-0.5">
                <p className="font-bold text-on-surface">{activeOrder.deliveryAddress.name}</p>
                <p className="text-on-surface-variant">{activeOrder.deliveryAddress.surveyOrDoor}</p>
                <p className="text-on-surface-variant">
                  {activeOrder.deliveryAddress.village}, {activeOrder.deliveryAddress.mandal}
                </p>
                <p className="text-on-surface-variant">
                  {activeOrder.deliveryAddress.district} - {activeOrder.deliveryAddress.pincode}
                </p>
                <p className="font-bold text-secondary mt-1">Phone: {activeOrder.deliveryAddress.phone}</p>
              </div>

              <div className="bg-secondary-container/30 p-3 rounded-lg text-[11px] leading-relaxed">
                <span className="font-bold text-primary flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">shield</span>
                  RythuMitra Purity Guarantee
                </span>
                <p className="text-on-surface-variant">
                  Do not accept bags if the holographic green seal is punctured. You have 100% right to inspect the test batch certificate before paying a single rupee.
                </p>
              </div>
            </div>

            {/* Live GPS Map Simulation */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 border border-surface-variant/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">Live Field Map Route</span>
                <span className="text-[11px] font-bold text-secondary bg-secondary-container/30 px-2 py-0.5 rounded">
                  14.2 km remaining
                </span>
              </div>
              <div
                className="w-full h-44 rounded-xl bg-cover bg-center relative overflow-hidden flex items-end p-2.5 shadow-inner"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9z_KVYzOexLqgI8Ged4ba0G8sGQjcEFSJfGDiKw5-24Jn8rcn8wF1HbgkzB8HgaeIXwWoX0jdxqQ7WbKlVOBIF0MTmUNGdN90tv-NmxAShy9H1RshS24AuBDvu-uThIXDJrGKzFFRHjf6l7xnMTGmYZeY8-HMtbmuoW5MM21n5lrBDd6SSy5NOs5Gy8vd2lAHT_702F96CcVACZqQdBGyaPi0ZLzIFvApeOFDq1TyHvV_5AEWKULM')"
                }}
              >
                <div className="bg-surface-container-lowest/90 backdrop-blur-xs p-2 rounded-lg text-[10px] w-full">
                  <span className="font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary">explore</span>
                    East Godavari Agri Van Fleet #7
                  </span>
                  <p className="text-on-surface-variant mt-0.5">Speed: 38 km/h • On Samalkot-Peddapuram Road</p>
                </div>
              </div>
            </div>

            {/* Need Help CTA */}
            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 text-xs space-y-2">
              <span className="font-bold text-primary block">Need Help with this Delivery?</span>
              <p className="text-[11px] text-on-surface-variant">
                Connect directly with our Mandal agricultural extension officers or reschedule farm delivery.
              </p>
              <div className="flex gap-2">
                <a
                  href="tel:18001801551"
                  className="flex-1 py-2 bg-surface-container-lowest text-primary rounded-lg text-center font-bold hover:bg-surface-container shadow-xs"
                >
                  Call 1800-180-1551
                </a>
                <button
                  onClick={() => showToast('Dispute / Reschedule ticket logged for delivery coordinator')}
                  className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-center font-bold hover:bg-primary-container"
                >
                  Reschedule Drop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
