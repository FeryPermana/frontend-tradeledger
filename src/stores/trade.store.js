import { defineStore } from "pinia";
import {
  fetchTrades,
  fetchTrade,
  createTrade,
  updateTrade,
  deleteTrade,
  exportTradesCsv,
} from "@/api/trade.api";

function defaultFilters() {
  return {
    search: "",
    account_id: "",
    asset_id: "",
    strategy_id: "",
    position_type: "",
    date_from: "",
    date_to: "",
    per_page: 15,
    page: 1,
    sort_by: "entry_date",
    sort_direction: "desc",
  };
}

function defaultPagination() {
  return {
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  };
}

function extractPaginatedPayload(res) {
  const payload = res?.data ?? {};

  return {
    items: payload?.data ?? [],
    pagination: {
      current_page: payload?.current_page ?? 1,
      per_page: payload?.per_page ?? 15,
      total: payload?.total ?? 0,
      last_page: payload?.last_page ?? 1,
      from: payload?.from ?? 0,
      to: payload?.to ?? 0,
    },
  };
}

export const useTradeStore = defineStore("trade", {
  state: () => ({
    items: [],
    detail: null,
    loading: false,
    pagination: defaultPagination(),
    filters: defaultFilters(),
  }),

  actions: {
    reset() {
      this.items = [];
      this.detail = null;
      this.loading = false;
      this.pagination = defaultPagination();
      this.filters = defaultFilters();
    },

    resetFilters() {
      this.filters = defaultFilters();
    },

    async getAll(customParams = {}) {
      this.loading = true;

      try {
        const params = {
          ...this.filters,
          ...customParams,
        };

        const res = await fetchTrades(params);
        const { items, pagination } = extractPaginatedPayload(res);

        this.items = items;
        this.pagination = pagination;

        return res;
      } finally {
        this.loading = false;
      }
    },

    async getOne(id) {
      this.loading = true;

      try {
        const res = await fetchTrade(id);
        this.detail = res.data ?? null;
        return res;
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      const res = await createTrade(payload);
      return res;
    },

    async update(id, payload) {
      const res = await updateTrade(id, payload);

      if (this.detail?.id === id) {
        this.detail = res.data?.data ?? this.detail;
      }

      return res;
    },

    async remove(id) {
      const res = await deleteTrade(id);

      this.items = this.items.filter((item) => item.id !== id);

      if (this.detail?.id === id) {
        this.detail = null;
      }

      return res;
    },

    async exportCsv(params = {}) {
      return await exportTradesCsv(params);
    },
  },
});
