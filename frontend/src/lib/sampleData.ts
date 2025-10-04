import { Product } from "@/app/types/products";

export const sampleProducts: Product[] = [
  {
    id: 1,
    title: "Wireless Headphones",
    miniTitle: "High-quality wireless headphones with noise cancellation.",
    description:
      "Experience the freedom of wireless listening with our top-of-the-line headphones. Featuring advanced noise cancellation technology, long battery life, and superior sound quality. These headphones are perfect for music lovers, travelers, and professionals who demand the best audio experience. With comfortable ear cushions and an adjustable headband, you can wear them all day without discomfort.",
    rating: 4.5,
    price: 199.99,
    image: "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
    ],
    isInFavorites: false,
    features: [
      "Active Noise Cancellation (ANC) technology",
      "40-hour battery life with quick charging",
      "Premium sound quality with deep bass",
      "Bluetooth 5.0 connectivity",
      "Foldable design with carrying case",
      "Built-in microphone for hands-free calls",
    ],
    sku: "WH-2024-001",
    category: "Headphones",
  },
  {
    id: 2,
    title: "Smart Watch",
    miniTitle:
      "Stay connected and track your fitness with this sleek smart watch.",
    description:
      "This smart watch offers a variety of features including heart rate monitoring, GPS tracking, and smartphone notifications. Perfect for staying active and connected on the go. Track your steps, calories, and sleep patterns with precision. The water-resistant design makes it suitable for swimming and all-weather activities. Customize watch faces and receive notifications from your favorite apps directly on your wrist.",
    rating: 4.0,
    price: 149.99,
    image: "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71Sv4VO394L._AC_SX679_.jpg",
    ],
    isInFavorites: true,
    features: [
      "Heart rate and blood oxygen monitoring",
      "Built-in GPS for accurate tracking",
      "Water-resistant up to 50 meters",
      "7-day battery life",
      "Multiple sports modes and workout tracking",
      "Sleep tracking and analysis",
      "Customizable watch faces",
    ],
    sku: "SW-2024-002",
    category: "Wearables",
  },
];
