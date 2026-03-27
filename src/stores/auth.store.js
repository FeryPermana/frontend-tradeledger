import { defineStore } from "pinia";
import authApi from "@/api/auth.api";
import { getToken, removeToken, saveToken } from "@/utils/storage";
import { useAccountStore } from "@/stores/account.store";
import { useAssetStore } from "@/stores/asset.store";
import { useStrategyStore } from "@/stores/strategy.store";
import { useTagStore } from "@/stores/tag.store";
import { useTradeStore } from "@/stores/trade.store";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: getToken(),
    user: null,
    loading: false,
    planStatus: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || "",
    isPremium: (state) => {
      if (!state.user?.is_premium || !state.user?.premium_expires_at)
        return false;
      return new Date(state.user.premium_expires_at) > new Date();
    },
    planName: (state) => state.planStatus?.plan || "free",
    accountLimitUsed: (state) => state.planStatus?.limits?.accounts_used ?? 0,
    accountLimitMax: (state) => state.planStatus?.limits?.accounts_limit,
    tradeLimitUsed: (state) => state.planStatus?.limits?.trades_used ?? 0,
    tradeLimitMax: (state) => state.planStatus?.limits?.trades_limit,
  },

  actions: {
    async login(payload) {
      this.loading = true;

      try {
        const response = await authApi.login(payload);
        this.token = response.data.access_token;
        this.user = response.data.user;

        saveToken(this.token);

        return response;
      } finally {
        this.loading = false;
      }
    },

    async register(payload) {
      this.loading = true;

      try {
        const response = await authApi.register(payload);
        this.token = response.data.access_token;
        this.user = response.data.user;
        saveToken(this.token);

        return response;
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      if (!this.token) return null;

      const response = await authApi.me();
      this.user = response.data.user;

      return response;
    },

    async fetchPlanStatus() {
      if (!this.token) return null;

      const response = await authApi.planStatus();
      this.planStatus = response.data.data;

      return response;
    },

    resetUserScopedStores() {
      useAccountStore().reset();
      useAssetStore().reset();
      useStrategyStore().reset();
      useTagStore().reset();
      useTradeStore().reset();
    },

    async logout() {
      try {
        if (this.token) {
          await authApi.logout();
        }
      } finally {
        this.token = null;
        this.user = null;
        this.planStatus = null;
        removeToken();
        this.resetUserScopedStores();
      }
    },
  },
});
