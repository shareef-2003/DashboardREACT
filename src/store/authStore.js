import { create } from "zustand";
import { api, setAuthToken } from "../services/api";
import { endpoints } from "../services/endpoints";

const TOKEN_KEY = "serva_token";
const USER_KEY = "serva_user";

const getStoredAuth = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY);

  if (!token) return null;

  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
};

const persistAuth = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  setAuthToken(null);
};

export const useAuthStore = create((set, get) => ({
  user_name: "",
  password: "",
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
  isLoggedIn: false,
  user: null,
  token: null,
  initialLoading: true,
  loading: false,
  error: "",
  passwordChangeError: "",
  passwordChangeSuccess: "",

  setField: (key, value) =>
    set({
      [key]: value,
      error: "",
      passwordChangeError: "",
      passwordChangeSuccess: "",
    }),

  resetFields: () =>
    set({
      user_name: "",
      password: "",
      error: "",
    }),

  resetPasswordFields: () =>
    set({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
      passwordChangeError: "",
      passwordChangeSuccess: "",
    }),

  initializeAuth: () => {
    const storedAuth = getStoredAuth();

    if (storedAuth?.token) {
      setAuthToken(storedAuth.token);
      set({
        isLoggedIn: true,
        token: storedAuth.token,
        user: storedAuth.user,
        initialLoading: false,
      });
      return;
    }

    clearAuth();
    set({ initialLoading: false, isLoggedIn: false, token: null, user: null });
  },

  login: async () => {
    try {
      const response = await api.post(endpoints.adminLogin, {
        user_name: get().user_name,
        password: get().password,
      });

      const token = response.data.data.token;
      const user = response.data.data.admin;

      localStorage.setItem("serva_token", token);
      localStorage.setItem("serva_user", JSON.stringify(user));

      setAuthToken(token);

      set({
        user,
        token,
        isLoggedIn: true,
        error: "",
      });

      return true;
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "بيانات تسجيل الدخول غير صحيحة";
      set({ error: errorMessage });
      return false;
    }
  },

  changePassword: async () => {
    const { current_password, new_password, new_password_confirmation } = get();

    if (!current_password || !new_password || !new_password_confirmation) {
      set({
        passwordChangeError:
          "يرجى إدخال كلمة المرور الحالية والجديدة وتأكيدها.",
      });
      return false;
    }

    set({ loading: true, passwordChangeError: "", passwordChangeSuccess: "" });

    try {
      const response = await api.post(endpoints.adminChangePassword, {
        current_password,
        new_password,
        new_password_confirmation,
      });

      const updatedUser = get().user
        ? { ...get().user, must_change_password: false }
        : null;

      if (updatedUser && get().token) {
        persistAuth({ token: get().token, user: updatedUser });
      }

      set({
        user: updatedUser,
        loading: false,
        passwordChangeSuccess:
          response?.data?.message || "تم تغيير كلمة المرور بنجاح.",
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
        passwordChangeError: "",
      });

      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "فشل تغيير كلمة المرور. يرجى المحاولة لاحقا.";

      set({
        passwordChangeError: message,
        passwordChangeSuccess: "",
        loading: false,
      });
      return false;
    }
  },

  logout: async () => {
    const { token } = get();

    set({ loading: true });

    try {
      if (token) {
        await api.post(endpoints.adminLogout);
      }
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      clearAuth();
      set({
        user_name: "",
        password: "",
        isLoggedIn: false,
        user: null,
        token: null,
        loading: false,
        error: "",
      });
    }
  },
}));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const hadSession =
        useAuthStore.getState().isLoggedIn || localStorage.getItem(TOKEN_KEY);

      if (hadSession) {
        clearAuth();
        clearAuth();

        // لا تعمل setState هنا نهائياً
        // فقط أعد التوجيه
        if (window.location.pathname !== "/login") {
          window.location.replace("/login?session=expired");
        }

        if (window.location.pathname !== "/login") {
          window.location.replace("/login?session=expired");
        }
      }
    }

    return Promise.reject(error);
  },
);
