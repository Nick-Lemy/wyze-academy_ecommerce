import axiosInstance from "@/lib/axios";

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CheckoutData {
  products: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  totalPrice: number;
  notes?: string;
}

export interface ValidationResult {
  productId: string;
  requestedQuantity: number;
  isValid: boolean;
  issues: string[];
  availableQuantity?: number;
  price?: number;
  title?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

// Validate cart before checkout
export const validateCart = async (
  products: CartItem[]
): Promise<{
  success: boolean;
  isValid: boolean;
  validationResults: ValidationResult[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
}> => {
  const { data } = await axiosInstance.post("/checkout/validate", { products });
  return data;
};

// Get shipping options
export const getShippingOptions = async (
  shippingAddress: ShippingAddress,
  totalPrice: number
): Promise<{
  success: boolean;
  shippingOptions: ShippingOption[];
}> => {
  const { data } = await axiosInstance.post("/checkout/shipping", {
    shippingAddress,
    totalPrice,
  });
  return data;
};

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    title: string;
  }>;
  status: string;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Create order (enhanced)
export const createOrder = async (
  checkoutData: CheckoutData
): Promise<{
  success: boolean;
  order: Order;
  message: string;
}> => {
  const { data } = await axiosInstance.post("/orders", checkoutData);
  return data;
};

// Cancel order
export const cancelOrder = async (
  orderId: string,
  reason?: string
): Promise<{
  success: boolean;
  order: Order;
  message: string;
}> => {
  const { data } = await axiosInstance.patch(`/orders/${orderId}/cancel`, {
    reason,
  });
  return data;
};

// Get order statistics for user
export const getUserOrderStats = async (): Promise<{
  success: boolean;
  stats: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  };
}> => {
  const { data } = await axiosInstance.get("/orders/my/stats");
  return data;
};
