import { defineStore } from "pinia";
import { fetchTags, createTag, deleteTag } from "@/api/tag.api";

export const useTagStore = defineStore("tag", {
  state: () => ({
    items: [],
    loading: false,
  }),

  actions: {
    reset() {
      this.items = [];
      this.loading = false;
    },

    async getAll(params = {}) {
      this.loading = true;

      try {
        const res = await fetchTags(params);
        this.items = res.data?.data ?? [];
        return res;
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      return await createTag(payload);
    },

    async remove(id) {
      return await deleteTag(id);
    },
  },
});
