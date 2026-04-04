import { defineStore } from "pinia";
import {
  fetchMyProfile,
  updateMyProfile,
  updateMyPassword,
} from "@/api/settings.api";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    profile: null,
    loading: false,
    savingProfile: false,
    savingPassword: false,
  }),

  actions: {
    reset() {
      this.profile = null;
      this.loading = false;
      this.savingProfile = false;
      this.savingPassword = false;
    },

    async getProfile() {
      this.loading = true;

      try {
        const res = await fetchMyProfile();
        this.profile = res.data?.user ?? null;
        return res;
      } finally {
        this.loading = false;
      }
    },

    async saveProfile(payload) {
      this.savingProfile = true;

      try {
        const res = await updateMyProfile(payload);
        this.profile = res.data?.user ?? this.profile;
        return res;
      } finally {
        this.savingProfile = false;
      }
    },

    async savePassword(payload) {
      this.savingPassword = true;

      try {
        return await updateMyPassword(payload);
      } finally {
        this.savingPassword = false;
      }
    },
  },
});