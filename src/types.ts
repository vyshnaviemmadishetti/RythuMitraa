export interface Product {
  id: string;
  name: string;
  localName?: string;
  brand: string;
  category: 'seeds' | 'fertilizers' | 'protection' | 'irrigation' | 'machinery' | 'organic' | 'cattle';
  cropTags: string[];
  image: string;
  additionalImages?: string[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  certified?: string;
  description: string;
  specification: string;
  packSize: string;
  unitWeight: string;
  stockStatus: 'in-stock' | 'low-stock';
  inStockCount: number;
  deliveryTime: string;
  isSubsidized?: boolean;
  subsidyAmount?: number;
  sku: string;
  dosage?: string;
  duration?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPack?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  subsidyDiscount: number;
  voucherDiscount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'kcc' | 'upi' | 'netbanking';
  status: 'confirmed' | 'tested' | 'in_transit' | 'delivered';
  currentLocation?: string;
  deliveryDate: string;
  deliveryAddress: {
    name: string;
    surveyOrDoor: string;
    village: string;
    mandal: string;
    district: string;
    pincode: string;
    phone: string;
  };
  agentName?: string;
  agentPhone?: string;
}

export interface DiseaseDiagnosis {
  id: string;
  diseaseName: string;
  localName: string;
  confidence: number;
  pathogen: string;
  cropName: string;
  symptoms: string;
  weatherFactor: string;
  chemicalRemedy: string;
  culturalRemedy: string;
  prescribedProductIds: string[];
  bundlePrice: number;
  sampleImage: string;
}

export interface MandiRate {
  crop: string;
  cropLocal: string;
  mandi: string;
  pricePerQtl: number;
  trend: 'up' | 'down';
  change: number;
}
