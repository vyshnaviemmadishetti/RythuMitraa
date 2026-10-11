import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '../types';
import { PRODUCTS } from '../data';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'subsidy' | 'weather' | 'pest';
  read: boolean;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[]; // product IDs
  orders: Order[];
  notifications: NotificationItem[];
  language: 'te' | 'en' | 'hi';
  currentPincode: string;
  selectedMandal: string;
  setLanguage: (lang: 'te' | 'en' | 'hi') => void;
  setPincode: (pin: string, mandal?: string) => void;
  addToCart: (product: Product, quantity?: number, selectedPack?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string) => void;
  moveAllWishlistToCart: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'date'>) => Order;
  markNotificationAsRead: (id: string) => void;
  cartCount: number;
  cartSubtotal: number;
  toastMessage: string | null;
  toastIcon: string;
  showToast: (msg: string, icon?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_CART: CartItem[] = [
  {
    product: PRODUCTS[0], // Bayer Arize 6444 Gold
    quantity: 2,
    selectedPack: '3 kg Bag'
  },
  {
    product: PRODUCTS[1], // Coromandel Gromor 28:28:0
    quantity: 1,
    selectedPack: '50 kg Bag'
  }
];

const INITIAL_WISHLIST: string[] = [
  'jain-drip-irrigation-1acre',
  'seminis-tomato-abhinash',
  'neptune-battery-sprayer-16l',
  'multiplex-bioneem-1l'
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'RM-2025-88421',
    date: '14 Oct 2025, 09:30 AM',
    items: [
      {
        productId: 'bayer-arize-6444-gold',
        productName: 'Bayer Arize 6444 Gold Hybrid Paddy Seeds (3 kg bag)',
        quantity: 2,
        price: 840,
        image: PRODUCTS[0].image
      },
      {
        productId: 'coromandel-gromor-28-28-0',
        productName: 'Coromandel Gromor 28:28:0 NPK Complex Fertilizer (50 kg)',
        quantity: 1,
        price: 1475,
        image: PRODUCTS[1].image
      },
      {
        productId: 'syngenta-ampligo-200ml',
        productName: 'Syngenta Ampligo Insecticide (200 ml)',
        quantity: 1,
        price: 1150,
        image: PRODUCTS[2].image
      }
    ],
    subtotal: 4305,
    subsidyDiscount: 0,
    voucherDiscount: 200,
    deliveryFee: 0,
    total: 4105,
    paymentMethod: 'cod',
    status: 'in_transit',
    currentLocation: 'Samalkot Junction (En route to Peddapuram)',
    deliveryDate: 'Thursday, 16 Oct by 4:00 PM',
    deliveryAddress: {
      name: 'S. Venkat Reddy (రైతు)',
      surveyOrDoor: 'Survey No. 44/2, Near Borewell & Sub-station Road',
      village: 'Peddapuram Village',
      mandal: 'Peddapuram Rural Mandal',
      district: 'East Godavari District, Andhra Pradesh',
      pincode: '533437',
      phone: '+91 99482 10982'
    },
    agentName: 'Ramesh Naidu (Tractor & Bolero Logistics)',
    agentPhone: '+91 98480 12345'
  },
  {
    id: 'RM-2024-31092',
    date: '18 Aug 2024, 11:20 AM',
    items: [
      {
        productId: 'seminis-tomato-abhinash',
        productName: 'Seminis F1 Hybrid Tomato Seeds - Abhinash (10g)',
        quantity: 3,
        price: 620,
        image: PRODUCTS[5].image
      },
      {
        productId: 'neptune-battery-sprayer-16l',
        productName: 'Neptune Fairland 16L Battery Knapsack Sprayer',
        quantity: 1,
        price: 1899,
        image: PRODUCTS[6].image
      }
    ],
    subtotal: 3759,
    subsidyDiscount: 450,
    voucherDiscount: 459,
    deliveryFee: 0,
    total: 2850,
    paymentMethod: 'kcc',
    status: 'delivered',
    deliveryDate: 'Delivered on 19 Aug 2024',
    deliveryAddress: {
      name: 'S. Venkat Reddy',
      surveyOrDoor: 'Door No. 3-84, Main Bazaar',
      village: 'Peddapuram Village',
      mandal: 'Peddapuram Rural',
      district: 'East Godavari',
      pincode: '533437',
      phone: '+91 99482 10982'
    }
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Order En Route (#RM-2025-88421)',
    message: 'Your certified seed delivery van is near Samalkot Junction. Expected drop tomorrow 4 PM.',
    time: '10 mins ago',
    type: 'order',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Kharif 2025 Subsidy Allocation Live',
    message: '₹2,000 Rythu Bharosa input voucher ready in your wallet for certified paddy and bio-fertilizers.',
    time: '2 hours ago',
    type: 'subsidy',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Weather & Pest Alert: Godavari Basin',
    message: 'High humidity (>85%) forecasted. Keep bio-neem spray ready to prevent leaf blast.',
    time: '1 day ago',
    type: 'weather',
    read: true
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rythu_cart');
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rythu_wishlist');
      return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
    } catch {
      return INITIAL_WISHLIST;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('rythu_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('rythu_notifs');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [language, setLanguageState] = useState<'te' | 'en' | 'hi'>(() => {
    try {
      const saved = localStorage.getItem('rythu_lang');
      return (saved as 'te' | 'en' | 'hi') || 'te';
    } catch {
      return 'te';
    }
  });

  const [currentPincode, setCurrentPincode] = useState<string>(() => {
    return localStorage.getItem('rythu_pincode') || '533437';
  });

  const [selectedMandal, setSelectedMandal] = useState<string>(() => {
    return localStorage.getItem('rythu_mandal') || 'Peddapuram Village, 533437';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<string>('check_circle');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('rythu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rythu_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('rythu_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rythu_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('rythu_lang', language);
  }, [language]);

  const showToast = (msg: string, icon = 'check_circle') => {
    setToastMessage(msg);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const setLanguage = (lang: 'te' | 'en' | 'hi') => {
    setLanguageState(lang);
    const langNames = { te: 'తెలుగు (Telugu)', en: 'English', hi: 'हिन्दी (Hindi)' };
    showToast(`Language set to ${langNames[lang]}`, 'translate');
  };

  const setPincode = (pin: string, mandal?: string) => {
    setCurrentPincode(pin);
    const loc = mandal || `Pincode ${pin}`;
    setSelectedMandal(loc);
    localStorage.setItem('rythu_pincode', pin);
    localStorage.setItem('rythu_mandal', loc);
    showToast(`Delivery location updated: ${loc}`, 'pin_drop');
  };

  const addToCart = (product: Product, quantity = 1, selectedPack?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, selectedPack: selectedPack || item.selectedPack }
            : item
        );
      }
      return [...prev, { product, quantity, selectedPack: selectedPack || product.packSize }];
    });
    showToast(`Added ${quantity}x ${product.name} to Cart! 🛒`, 'shopping_bag');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'delete');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string): boolean => {
    const isSaved = wishlist.includes(productId);
    const product = PRODUCTS.find((p) => p.id === productId);
    const title = product ? product.name : 'Product';

    if (isSaved) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast(`Removed from Wishlist: ${title}`, 'heart_broken');
      return false;
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast(`Saved to Wishlist: ${title}`, 'favorite');
      return true;
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveToCartFromWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    addToCart(product, 1);
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const moveAllWishlistToCart = () => {
    wishlist.forEach((id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (product) {
        addToCart(product, 1);
      }
    });
    setWishlist([]);
    showToast('All wishlist items moved to your Farm Cart! 🛒', 'shopping_cart_checkout');
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'date'>): Order => {
    const newId = `RM-2025-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newOrder: Order = {
      ...orderData,
      id: newId,
      date: dateStr,
      status: 'confirmed',
      currentLocation: 'East Godavari Central Agri Depot',
      agentName: 'Ramesh Naidu (Tractor Logistics)',
      agentPhone: '+91 98480 12345'
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Order Booked: #${newId}`,
      message: `Your booking for ₹${newOrder.total} is confirmed. Farm delivery scheduled in 24-48 hrs.`,
      time: 'Just now',
      type: 'order',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newOrder;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        notifications,
        language,
        currentPincode,
        selectedMandal,
        setLanguage,
        setPincode,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        moveAllWishlistToCart,
        createOrder,
        markNotificationAsRead,
        cartCount,
        cartSubtotal,
        toastMessage,
        toastIcon,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
