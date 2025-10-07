import axiosInstance from "@/lib/axios";

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  status: "pending" | "paid" | "received" | "shipping" | "cancelled";
  shippingAddress: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  products: OrderProduct[];
  shippingAddress: string;
  totalPrice: number;
}

export interface CreateOrderResponse {
  order: Order;
  message: string;
}

// Create a new order
export const createOrder = async (
  data: CreateOrderData
): Promise<CreateOrderResponse> => {
  const { data: response } = await axiosInstance.post<CreateOrderResponse>(
    "/orders",
    data
  );
  return response;
};

// Get all user's orders
export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await axiosInstance.get<Order[]>("/orders/my");
  return data;
};

// Get specific order by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
  const { data } = await axiosInstance.get<Order>(`/orders/${orderId}`);
  return data;
};

// Update order status (admin only typically, but included for completeness)
export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
): Promise<CreateOrderResponse> => {
  const { data } = await axiosInstance.patch<CreateOrderResponse>(
    `/orders/${orderId}/status`,
    { status }
  );
  return data;
};
