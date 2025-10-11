import { apiClient, ApiResponse, ApiListResponse } from "../apiClient";

export interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  miniTitle?: string;
  description?: string;
  stock: number;
  isFeatured: boolean;
  averageRating?: number;
  reviewCount?: number;
  tags?: string[];
}

export interface SearchSuggestion {
  _id: string;
  title: string;
  category: string;
  image: string;
  price: number;
}

export interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  tags: string[];
  sortOptions: Array<{
    value: string;
    label: string;
  }>;
}

export interface SearchFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: string;
  sortBy?: string;
  sortOrder?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  tags?: string | string[];
  page?: number;
  limit?: number;
}

export interface SearchFacets {
  categories: Array<{
    _id: string;
    count: number;
  }>;
  priceRanges: Array<{
    _id: string | number;
    count: number;
  }>;
}

export interface AdvancedSearchResponse extends ApiListResponse<Product> {
  facets?: SearchFacets;
}

export class SearchAPI {
  // Get all products with filtering and pagination
  static async getProducts(
    filters: SearchFilters = {}
  ): Promise<ApiListResponse<Product>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          params.append(key, value.join(","));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await apiClient.get<{
      products: Product[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/public/products?${params.toString()}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.products,
        pagination: {
          page: response.data.pagination.currentPage,
          limit: response.data.pagination.limit,
          total: response.data.pagination.totalCount,
          totalPages: response.data.pagination.totalPages,
        },
      };
    }

    return {
      success: false,
      error: response.error,
    };
  }

  // Get search suggestions
  static async getSearchSuggestions(
    query: string,
    limit: number = 5
  ): Promise<ApiResponse<SearchSuggestion[]>> {
    if (!query || query.length < 2) {
      return {
        success: true,
        data: [],
      };
    }

    const response = await apiClient.get<{ suggestions: SearchSuggestion[] }>(
      `/public/products/search/suggestions?q=${encodeURIComponent(
        query
      )}&limit=${limit}`
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.suggestions,
      };
    }

    return {
      success: false,
      error: response.error,
    };
  }

  // Get filter options
  static async getFilterOptions(): Promise<ApiResponse<FilterOptions>> {
    const response = await apiClient.get<{ filters: FilterOptions }>(
      "/public/products/filters"
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.filters,
      };
    }

    return {
      success: false,
      error: response.error,
    };
  }

  // Advanced search with faceted results
  static async advancedSearch(
    filters: SearchFilters = {}
  ): Promise<AdvancedSearchResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          params.append(key, value.join(","));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await apiClient.get<{
      products: Product[];
      facets: SearchFacets;
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/public/products/search/advanced?${params.toString()}`);

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.products,
        pagination: {
          page: response.data.pagination.currentPage,
          limit: response.data.pagination.limit,
          total: response.data.pagination.totalCount,
          totalPages: response.data.pagination.totalPages,
        },
        facets: response.data.facets,
      };
    }

    return response as AdvancedSearchResponse;
  }

  // Get product by ID
  static async getProductById(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/public/products/${id}`);
  }

  // Get related products
  static async getRelatedProducts(
    id: string,
    limit: number = 4
  ): Promise<ApiResponse<Product[]>> {
    const response = await apiClient.get<{ products: Product[] }>(
      `/public/products/${id}/related?limit=${limit}`
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.products,
      };
    }

    return {
      success: false,
      error: response.error,
    };
  }

  // Get featured products
  static async getFeaturedProducts(
    limit: number = 8
  ): Promise<ApiResponse<Product[]>> {
    const response = await apiClient.get<{ products: Product[] }>(
      `/public/products/featured?limit=${limit}`
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.products,
      };
    }

    return {
      success: false,
      error: response.error,
    };
  }

  // Get categories
  static async getCategories(): Promise<ApiResponse<string[]>> {
    const response = await apiClient.get<{ categories: string[] }>(
      "/public/products/categories"
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.categories,
      };
    }

    return {
      success: false,
      error: response.error,
    };
  }
}

// React hooks for search functionality
export const useSearch = () => {
  const searchProducts = async (
    filters: SearchFilters,
    showErrorToast = true
  ) => {
    const response = await SearchAPI.getProducts(filters);

    if (!response.success && showErrorToast && response.error) {
      // Handle error display
      console.error("Search failed:", response.error);
    }

    return response;
  };

  const getSearchSuggestions = async (query: string, limit?: number) => {
    return SearchAPI.getSearchSuggestions(query, limit);
  };

  const getFilterOptions = async () => {
    return SearchAPI.getFilterOptions();
  };

  const advancedSearch = async (filters: SearchFilters) => {
    return SearchAPI.advancedSearch(filters);
  };

  return {
    searchProducts,
    getSearchSuggestions,
    getFilterOptions,
    advancedSearch,
    getProductById: SearchAPI.getProductById,
    getRelatedProducts: SearchAPI.getRelatedProducts,
    getFeaturedProducts: SearchAPI.getFeaturedProducts,
    getCategories: SearchAPI.getCategories,
  };
};
