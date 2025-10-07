import axiosInstance from "@/lib/axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  role: "user" | "admin";
  favorites: string[];
  cart: string[];
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Login API call
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>(
    "/auth/login",
    credentials
  );
  return data;
};

// Register API call
export const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>(
    "/auth/register",
    credentials
  );
  return data;
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  return !!token;
};

// Save auth data to localStorage
export const saveAuthData = (user: User, token: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Get user profile from API
export const getUserProfile = async (): Promise<User> => {
  const { data } = await axiosInstance.get<User>("/auth/profile");
  // Update localStorage with fresh data
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

// Update user profile
export const updateUserProfile = async (
  userData: UpdateUserData
): Promise<User> => {
  const { data } = await axiosInstance.put<User>("/auth/profile", userData);
  // Update localStorage with fresh data
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};
