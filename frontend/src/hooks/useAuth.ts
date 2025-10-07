"use client";

import { useState, useEffect } from "react";
import { User, getCurrentUser, isAuthenticated, logout } from "@/lib/api/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication on mount
    const currentUser = getCurrentUser();
    const authStatus = isAuthenticated();
    setUser(currentUser);
    setAuthenticated(authStatus);
    setLoading(false);
  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
  };

  return {
    user,
    loading,
    isAuthenticated: authenticated,
    updateUser,
    logout,
  };
}
