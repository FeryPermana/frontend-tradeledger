import { defineStore } from "pinia";
import {
  fetchPortfolioPositions,
  fetchPortfolioPosition,
  fetchPortfolioSummary,
  createPortfolioPosition,
  updatePortfolioPosition,
  updatePortfolioCurrentPrice,
  deletePortfolioPosition,
  fetchPortfolioAllocation,
  partialClosePortfolio,
} from "@/api/portfolio.api";

export const usePortfolioStore = defineStore("portfolio", {
  state: () => ({
    items: [],
    detail: null,
    summary: null,
    allocation: null,
    loading: false,
    filters: {
      search: "",
      conviction_level: "",
      horizon: "",
      watchlist_only: false,
    },
  }),

  actions: {
    reset() {
      this.items = [];
      this.detail = null;
      this.summary = null;
      this.allocation = null;
      this.loading = false;
      this.filters = {
        search: "",
        conviction_level: "",
        horizon: "",
        watchlist_only: false,
      };
    },

    async getAll(customParams = {}) {
      this.loading = true;

      try {
        const params = {
          ...this.filters,
          ...customParams,
        };

        const res = await fetchPortfolioPositions(params);
        this.items = res.data?.data ?? [];
        return res;
      } finally {
        this.loading = false;
      }
    },

    async getSummary(customParams = {}) {
      const params = {
        ...this.filters,
        ...customParams,
      };

      const res = await fetchPortfolioSummary(params);
      this.summary = res.data ?? null;
      return res;
    },

    async getOne(id) {
      this.loading = true;

      try {
        const res = await fetchPortfolioPosition(id);
        this.detail = res.data ?? null;
        return res;
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      return await createPortfolioPosition(payload);
    },

    async update(id, payload) {
      const res = await updatePortfolioPosition(id, payload);

      if (this.detail?.id === id) {
        this.detail = res.data ?? this.detail;
      }

      return res;
    },

    async updateCurrentPrice(id, payload) {
      const res = await updatePortfolioCurrentPrice(id, payload);

      const updated = res.data ?? null;

      if (updated) {
        this.items = this.items.map((item) => (item.id === id ? updated : item));

        if (this.detail?.id === id) {
          this.detail = updated;
        }
      }

      return res;
    },

    async remove(id) {
      const res = await deletePortfolioPosition(id);

      this.items = this.items.filter((item) => item.id !== id);

      if (this.detail?.id === id) {
        this.detail = null;
      }

      return res;
    },

    async partialClose(id, payload) {
      return await partialClosePortfolio(id, payload);
    },

    async getAllocation(customParams = {}) {
      const params = {
        ...this.filters,
        ...customParams,
      };

      const res = await fetchPortfolioAllocation(params);
      this.allocation = res.data ?? null;
      return res;
    },
  },
});