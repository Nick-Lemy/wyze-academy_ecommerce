export type Product = {
  id: string | number;
  title: string;
  miniTitle: string;
  description: string;
  rating: number;
  price: number;
  image: string;
  images?: string[];
  isInFavorites: boolean;
  features?: string[];
  sku?: string;
  category?: string;
};
