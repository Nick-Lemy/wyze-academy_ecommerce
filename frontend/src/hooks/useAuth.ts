"use client";

import { useState, useEffect } from "react";
import { User, getCurrentUser, isAuthenticated, logout } from "@/lib/api/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
  };

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    updateUser,
    logout,
  };
}
