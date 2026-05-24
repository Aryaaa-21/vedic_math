import { create } from "zustand";
import { apiFetch, clearAuthToken, getAuthToken, setAuthToken, TOKEN_KEY } from "@/utils/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  joinedDate?: string;
  level: number;
  xp: number;
  streak: number;
  accuracy: number;
  badges: any[];
  completedTechniques: any[];
  challengeHistory: any[];
  profileImage: string;
  avgSpeed?: number;
  completedLessons?: number;
  challengeHighScore?: number;
  avatar?: string;
  recentActivities?: any[];
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<AuthUser>;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<AuthUser | null>;
  getCurrentUser: () => Promise<AuthUser | null>;
}

const readError = async (res: Response, fallback: string) => {
  try {
    const data = await res.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
};

const storeSession = (token: string, user: AuthUser) => {
  setAuthToken(token);
  useAuthStore.setState({
    token,
    user,
    isAuthenticated: true,
    loading: false
  });
};

const clearSession = () => {
  clearAuthToken();
  useAuthStore.setState({
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false
  });
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  isAuthenticated: false,
  loading: true,

  signup: async (name, email, password) => {
    set({ loading: true });
    const res = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      set({ loading: false });
      throw new Error(await readError(res, "Failed to sign up"));
    }

    const data = await res.json();
    storeSession(data.token, data.user);
    return data.user;
  },

  login: async (email, password) => {
    set({ loading: true });
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      set({ loading: false });
      throw new Error(await readError(res, "Invalid email or password"));
    }

    const data = await res.json();
    storeSession(data.token, data.user);
    return data.user;
  },

  logout: async () => {
    try {
      if (get().token || getAuthToken()) {
        await apiFetch("/auth/logout", { method: "POST" });
      }
    } finally {
      clearSession();
    }
  },

  checkAuth: async () => {
    const token = getAuthToken();

    if (!token) {
      clearSession();
      return null;
    }

    set({ token, loading: true });
    const res = await apiFetch("/auth/verify");

    if (!res.ok) {
      clearSession();
      return null;
    }

    const data = await res.json();
    set({
      token,
      user: data.user,
      isAuthenticated: true,
      loading: false
    });
    return data.user;
  },

  getCurrentUser: async () => {
    const token = getAuthToken();

    if (!token) {
      clearSession();
      return null;
    }

    const res = await apiFetch("/auth/me");

    if (!res.ok) {
      clearSession();
      return null;
    }

    const data = await res.json();
    set({
      token,
      user: data.user,
      isAuthenticated: true,
      loading: false
    });
    return data.user;
  }
}));
