import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import AppShell from "@/components/layout/AppShell.vue";

const routes = [
  {
    path: "/",
    name: "landingpage",
    component: () => import("@/views/landingpage/landingpage.vue"),
    meta: { title: "TradeLedger" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { guestOnly: true, title: "Login" },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/RegisterView.vue"),
    meta: { guestOnly: true, title: "Register" },
  },
  {
    path: "/verify-email",
    name: "verify-email",
    component: () => import("@/views/auth/VerifyEmailView.vue"),
    meta: { requiresAuth: true, title: "Verify Email" },
  },
  {
    path: "/email-verification/success",
    name: "email-verification-success",
    component: () => import("@/views/auth/EmailVerificationSuccessView.vue"),
    meta: { title: "Email Verification Success" },
  },
  {
    path: "/email-verification/error",
    name: "email-verification-error",
    component: () => import("@/views/auth/EmailVerificationErrorView.vue"),
    meta: { title: "Email Verification Error" },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
  },
  {
    path: "/dash",
    component: AppShell,
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard/DashboardView.vue"),
        meta: { title: "Dashboard" },
      },
      {
        path: "accounts",
        name: "accounts",
        component: () => import("@/views/accounts/AccountsView.vue"),
        meta: { title: "Accounts" },
      },
      {
        path: "assets",
        name: "assets",
        component: () => import("@/views/assets/AssetsView.vue"),
        meta: { title: "Assets" },
      },
      {
        path: "strategies",
        name: "strategies",
        component: () => import("@/views/strategies/StrategiesView.vue"),
        meta: { title: "Strategies" },
      },
      {
        path: "tags",
        name: "tags",
        component: () => import("@/views/tags/TagsView.vue"),
        meta: { title: "Tags" },
      },
      {
        path: "trades",
        name: "trades",
        component: () => import("@/views/trades/TradesView.vue"),
        meta: { title: "Trades" },
      },
      {
        path: "portfolio",
        name: "portfolio",
        component: () => import("@/views/portfolio/PortfolioView.vue"),
        meta: { title: "Portfolio" },
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("@/views/settings/SettingsView.vue"),
        meta: { title: "Settings" },
      },
      {
        path: "payment",
        name: "payment",
        component: () => import("@/views/payments/PaymentPage.vue"),
        meta: { title: "Payment" },
      },
      {
        path: "admin/payments",
        name: "admin-payments",
        component: () => import("@/views/admin/AdminPaymentsView.vue"),
        meta: { title: "Admin Payments" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getPlanRedirect(plan) {
  if (plan === "pro_monthly") {
    return { path: "/payment", query: { plan: "monthly" } };
  }

  if (plan === "pro_yearly") {
    return { path: "/payment", query: { plan: "yearly" } };
  }

  return { path: "/dash/dashboard" };
}

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchMe();
    } catch {
      await authStore.logout();
      return next("/login");
    }
  }

  const isAuthenticated = authStore.isAuthenticated;
  const isEmailVerified = !!authStore.user?.email_verified_at;
  const selectedPlan = to.query.plan;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      path: "/login",
      query: selectedPlan ? { plan: selectedPlan } : {},
    });
  }

  if (to.meta.guestOnly && isAuthenticated) {
    if (!isEmailVerified) {
      return next("/verify-email");
    }

    if (selectedPlan === "monthly" || selectedPlan === "yearly") {
      return next(getPlanRedirect(selectedPlan));
    }

    return next("/dash/dashboard");
  }

  if (
    isAuthenticated &&
    authStore.user &&
    !isEmailVerified &&
    to.path !== "/verify-email" &&
    to.path !== "/email-verification/success" &&
    to.path !== "/email-verification/error"
  ) {
    return next("/verify-email");
  }

  if (isAuthenticated && isEmailVerified && to.path === "/verify-email") {
    return next("/dash/dashboard");
  }

  if (
    to.name === "admin-payments" &&
    authStore.user?.email !== "akuntesting@gmail.com"
  ) {
    return next("/dash/dashboard");
  }

  next();
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | TradeLedger`
    : "TradeLedger";
});

export default router;
