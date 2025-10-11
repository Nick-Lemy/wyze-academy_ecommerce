import axiosInstance from "@/lib/axios";

export interface Product {
  _id: string;
  title: string;
  miniTitle: string;
  description: string;
  rating: number;
  price: number;
  image: {
    url: string;
    public_id: string;
  };
  images: Array<{
    url: string;
    public_id: string;
  }>;
  features: string[];
  sku: string;
  category: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductsResponse {
  products: Product[];
  pagination?: PaginationInfo;
}

// Get all products with optional search parameters
export const getProducts = async (
  queryParams?: string
): Promise<ProductsResponse> => {
  const url = queryParams ? `/products?${queryParams}` : "/products";
  const { data } = await axiosInstance.get(url);

  // Handle both old format (Product[]) and new format ({ products: Product[], pagination })
  if (Array.isArray(data)) {
    return { products: data };
  }
  return data;
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await axiosInstance.get<Product>(`/products/${id}`);
  return data;
};

// Add product to favorites
export const addToFavorites = async (productId: string): Promise<void> => {
  await axiosInstance.post(`/products/favorites/${productId}`);
};

// Remove product from favorites
export const removeFromFavorites = async (productId: string): Promise<void> => {
  await axiosInstance.delete(`/products/favorites/${productId}`);
};

// Add product to cart
export const addToCart = async (
  productId: string,
  quantity: number = 1
): Promise<void> => {
  await axiosInstance.post(`/products/cart/${productId}`, { quantity });
};

// Remove product from cart
export const removeFromCart = async (productId: string): Promise<void> => {
  await axiosInstance.delete(`/products/cart/${productId}`);
};

// Toggle favorite (helper function)
export const toggleFavorite = async (
  productId: string,
  isFavorite: boolean
): Promise<void> => {
  if (isFavorite) {
    await removeFromFavorites(productId);
  } else {
    await addToFavorites(productId);
  }
};

// Toggle cart (helper function)
export const toggleCart = async (
  productId: string,
  isInCart: boolean
): Promise<void> => {
  if (isInCart) {
    await removeFromCart(productId);
  } else {
    await addToCart(productId);
  }
};
