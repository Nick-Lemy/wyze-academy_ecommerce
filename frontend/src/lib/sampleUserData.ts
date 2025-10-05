import { User, Order } from "@/app/types/user";

export const sampleUser: User = {
  id: 1,
  firstName: "Nick",
  lastName: "Lemy",
  email: "nicklemy@gmail.com",
  phone: "+250 (793) 246 060",
  address: {
    street: "456 Main Street, Apt 12",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "United States",
  },
  createdAt: "2024-01-15",
};

export const sampleOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-2025-001",
    items: [
      {
        id: 1,
        productId: 1,
        productTitle: "Wireless Headphones",
        productImage:
          "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
        quantity: 1,
        price: 199.99,
      },
    ],
    totalAmount: 199.99,
    status: "delivered",
    orderDate: "2025-09-15",
    deliveryDate: "2025-09-20",
    shippingAddress: {
      street: "456 Main Street, Apt 12",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "United States",
    },
  },
  {
    id: 2,
    orderNumber: "ORD-2025-002",
    items: [
      {
        id: 2,
        productId: 2,
        productTitle: "Smart Watch",
        productImage:
          "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
        quantity: 2,
        price: 149.99,
      },
    ],
    totalAmount: 299.98,
    status: "shipped",
    orderDate: "2025-10-01",
    deliveryDate: "2025-10-08",
    shippingAddress: {
      street: "456 Main Street, Apt 12",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "United States",
    },
  },
  {
    id: 3,
    orderNumber: "ORD-2025-003",
    items: [
      {
        id: 3,
        productId: 1,
        productTitle: "Wireless Headphones",
        productImage:
          "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
        quantity: 1,
        price: 199.99,
      },
      {
        id: 4,
        productId: 2,
        productTitle: "Smart Watch",
        productImage:
          "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
        quantity: 1,
        price: 149.99,
      },
    ],
    totalAmount: 349.98,
    status: "processing",
    orderDate: "2025-10-05",
    shippingAddress: {
      street: "456 Main Street, Apt 12",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "United States",
    },
  },
];
