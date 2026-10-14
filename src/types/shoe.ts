export interface ShoeColor {
  name: string;
  hex: string;
  twClass?: string;
}

export interface ShoeReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  fitFeedback: 'Runs Small' | 'True to Size' | 'Runs Large';
}

export interface ShoeSpecs {
  weight: string;
  heelDrop: string;
  cushioning: string;
  upper: string;
  closure: string;
  traction: string;
}

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  category: 'Running' | 'Basketball' | 'Lifestyle' | 'Trail & Outdoor' | 'Skateboarding' | 'Streetwear';
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  colors: ShoeColor[];
  sizes: number[];
  images: string[];
  tag?: 'Best Seller' | 'New Drop' | 'Sale' | 'Limited Edition' | 'Staff Pick';
  description: string;
  specs: ShoeSpecs;
  reviews: ShoeReview[];
  releaseYear?: number;
  sku: string;
}

export interface CartItem {
  id: string; // unique cart item id (e.g. shoeId + size + color)
  shoeId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  size: number;
  color: string;
  quantity: number;
}

export interface OrderItem {
  shoeId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  size: number;
  color: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: 'standard' | 'express' | 'overnight';
  shippingCost: number;
  discount: number;
  promoCode?: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'apple_pay' | 'cod';
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP';
