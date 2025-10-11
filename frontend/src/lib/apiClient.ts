import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ErrorService, AppError } from "./errorHandling";

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: AppError;
  message?: string;
}

export interface ApiListResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
    this.loadAuthToken();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add request timestamp for debugging
        if (process.env.NODE_ENV === "development") {
          console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`[API] Response ${response.status}:`, response.data);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Clear invalid token
          this.clearAuthToken();

          // Redirect to login if in browser
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
        }

        // Retry logic for network errors
        if (
          this.shouldRetry(error) &&
          originalRequest._retryCount < API_CONFIG.retryAttempts
        ) {
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

          await this.delay(API_CONFIG.retryDelay * originalRequest._retryCount);

          return this.client(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: unknown): boolean {
    // Retry on network errors and 5xx server errors
    if (axios.isAxiosError(error)) {
      return (
        !error.response ||
        (error.response.status >= 500 && error.response.status < 600)
      );
    }
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private loadAuthToken() {
    if (typeof window !== "undefined") {
      this.authToken = localStorage.getItem("authToken");
    }
  }

  public setAuthToken(token: string) {
    this.authToken = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  public clearAuthToken() {
    this.authToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  // Generic request method with error handling
  private async request<T = unknown>(
    config: AxiosRequestConfig,
    context?: string
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client(config);

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    } catch (error) {
      const appError = ErrorService.handleError(error, context);

      return {
        success: false,
        error: appError,
      };
    }
  }

  // HTTP Methods
  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        method: "GET",
        url,
        params,
        ...config,
      },
      `GET ${url}`
    );
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        method: "POST",
        url,
        data,
        ...config,
      },
      `POST ${url}`
    );
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        method: "PUT",
        url,
        data,
        ...config,
      },
      `PUT ${url}`
    );
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        method: "PATCH",
        url,
        data,
        ...config,
      },
      `PATCH ${url}`
    );
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        method: "DELETE",
        url,
        ...config,
      },
      `DELETE ${url}`
    );
  }

  // File upload method
  async uploadFile<T = unknown>(
    url: string,
    file: File,
    additionalData?: Record<string, unknown>,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, String(additionalData[key]));
      });
    }

    return this.request<T>(
      {
        method: "POST",
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      },
      `UPLOAD ${url}`
    );
  }

  // Paginated requests
  async getPaginated<T = unknown>(
    url: string,
    page: number = 1,
    limit: number = 10,
    additionalParams?: Record<string, unknown>
  ): Promise<ApiListResponse<T>> {
    const response = await this.get<{
      data: T[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(url, {
      page,
      limit,
      ...additionalParams,
    });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
      };
    }

    return {
      success: false,
      error: response.error,
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get("/health");
      return response.success;
    } catch {
      return false;
    }
  }

  // Get API info
  async getApiInfo(): Promise<
    ApiResponse<{ version: string; environment: string }>
  > {
    return this.get("/info");
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Convenience functions for common patterns
export const withApiErrorHandling = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  showErrorToast: boolean = true
): Promise<T | null> => {
  const response = await apiCall();

  if (response.success && response.data !== undefined) {
    return response.data;
  }

  if (response.error && showErrorToast) {
    ErrorService.showErrorToast(response.error);
  }

  return null;
};

// React hook for API calls
export const useApi = () => {
  const callApi = async <T>(
    apiCall: () => Promise<ApiResponse<T>>,
    options: {
      showErrorToast?: boolean;
      onSuccess?: (data: T) => void;
      onError?: (error: AppError) => void;
    } = {}
  ): Promise<T | null> => {
    const { showErrorToast = true, onSuccess, onError } = options;

    const response = await apiCall();

    if (response.success && response.data !== undefined) {
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    }

    if (response.error) {
      if (onError) {
        onError(response.error);
      } else if (showErrorToast) {
        ErrorService.showErrorToast(response.error);
      }
    }

    return null;
  };

  return { callApi, apiClient };
};

// Type-safe API endpoint builder
export class ApiEndpoints {
  static readonly AUTH = {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    profile: "/auth/profile",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  } as const;

  static readonly USERS = {
    list: "/users",
    profile: "/users/profile",
    updateProfile: "/users/profile",
    changePassword: "/users/change-password",
    orders: "/users/orders",
    addresses: "/users/addresses",
    favorites: "/users/favorites",
  } as const;

  static readonly PRODUCTS = {
    list: "/public/products",
    detail: (id: string) => `/public/products/${id}`,
    search: "/public/products/search",
    categories: "/public/products/categories",
    featured: "/public/products/featured",
    admin: {
      list: "/products",
      create: "/products",
      update: (id: string) => `/products/${id}`,
      delete: (id: string) => `/products/${id}`,
      upload: "/products/upload",
    },
  } as const;

  static readonly ORDERS = {
    list: "/orders",
    create: "/orders",
    detail: (id: string) => `/orders/${id}`,
    update: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
    admin: {
      list: "/admin/orders",
      update: (id: string) => `/admin/orders/${id}`,
      stats: "/admin/orders/stats",
    },
  } as const;

  static readonly CHECKOUT = {
    validate: "/checkout/validate",
    shipping: "/checkout/shipping",
    payment: "/checkout/payment",
    complete: "/checkout/complete",
  } as const;

  static readonly ADMIN = {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    products: "/admin/products",
    orders: "/admin/orders",
    stats: "/admin/stats",
  } as const;
}

export default apiClient;
