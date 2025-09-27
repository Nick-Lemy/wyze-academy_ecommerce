import { Product } from "@/app/types/products";

export const sampleProducts: Product[] = [
  {
    id: 1,
    title: "Wireless Headphones",
    miniTitle: "High-quality wireless headphones with noise cancellation.",
    description:
      "Experience the freedom of wireless listening with our top-of-the-line headphones. Featuring advanced noise cancellation technology, long battery life, and superior sound quality.",
    rating: 4.5,
    price: 199.99,
    image: "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
    isInFavorites: false,
  },
  {
    id: 2,
    title: "Smart Watch",
    miniTitle:
      "Stay connected and track your fitness with this sleek smart watch.",
    description:
      "This smart watch offers a variety of features including heart rate monitoring, GPS tracking, and smartphone notifications. Perfect for staying active and connected on the go.",
    rating: 4.0,
    price: 149.99,
    image: "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
    isInFavorites: true,
  },
];
