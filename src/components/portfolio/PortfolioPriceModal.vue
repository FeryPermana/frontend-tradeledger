<template>
    <div v-if="open" class="fixed inset-0 z-50 bg-black/60 px-4 py-4 sm:px-6">
        <div class="flex min-h-full items-center justify-center">
            <div class="modal-panel flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl shadow-2xl">
                <div class="modal-header flex items-center justify-between px-5 py-4 sm:px-6">
                    <div>
                        <h3 class="modal-title text-xl font-semibold">Manage Position</h3>
                        <p class="page-subtitle mt-1 text-sm">{{ itemLabel }}</p>
                    </div>

                    <button type="button" class="modal-close rounded-xl px-3 py-2 text-sm transition"
                        @click="$emit('close')">
                        ✕
                    </button>
                </div>

                <div class="modal-body overflow-y-auto px-5 py-5 sm:px-6">
                    <div v-if="selectedAssetCategory === 'stock'" class="alert-info mb-4 rounded-2xl px-4 py-3 text-sm">
                        <p>
                            Stock reference: <span class="alert-info-strong font-semibold">1 lot = 100 shares</span>.
                        </p>
                        <p class="mt-1">
                            Quantity input in this form still uses <span
                                class="alert-info-strong font-semibold">shares</span>, not lots.
                        </p>
                    </div>

                    <form class="space-y-5" @submit.prevent="submit">
                        <div class="surface-soft rounded-2xl p-4">
                            <p class="page-body mb-3 text-sm font-medium">Edit Price</p>

                            <BaseInput v-model="form.current_price" label="Current Price" type="number"
                                placeholder="1234.56" />
                        </div>

                        <div class="warning-soft rounded-2xl p-4">
                            <p class="warning-title mb-1 text-sm font-medium">Partial Close</p>

                            <p class="page-subtitle mb-3 text-xs leading-5">
                                Available quantity:
                                <span class="page-title font-semibold">
                                    {{ availableQuantityDisplay }} shares
                                </span>
                                <span v-if="selectedAssetCategory === 'stock'" class="page-subtitle">
                                    ({{ availableLotsDisplay }} lots)
                                </span>
                            </p>

                            <div class="grid gap-4 md:grid-cols-2">
                                <BaseInput v-model="form.close_quantity" label="Close Quantity (Shares)" type="number"
                                    placeholder="1234.56" :error="errors.close_quantity" />

                                <BaseInput v-model="form.close_price" label="Exit Price" type="number"
                                    placeholder="1234.56" :error="errors.close_price" />

                                <BaseInput v-model="form.close_fee" label="Sell Fee" type="number" placeholder="1234.56"
                                    :error="errors.close_fee" />

                                <BaseInput v-model="form.close_date" label="Exit Date" type="datetime-local"
                                    :error="errors.close_date" />
                            </div>
                        </div>

                        <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                            <BaseButton type="button" variant="secondary" class="w-full sm:w-auto"
                                @click="$emit('close')">
                                Cancel
                            </BaseButton>

                            <BaseButton type="submit" class="w-full sm:w-auto" :loading="loading">
                                Save
                            </BaseButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import { toastService } from "@/utils/toast";

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    item: {
        type: Object,
        default: null,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["close", "submit"]);

const form = reactive({
    current_price: "",
    close_quantity: "",
    close_price: "",
    close_fee: "",
    close_date: "",
});

const errors = reactive({
    close_quantity: "",
    close_price: "",
    close_fee: "",
    close_date: "",
});

const itemLabel = computed(() => {
    const symbol = props.item?.asset?.symbol || "-";
    const name = props.item?.asset?.name || "";
    return name ? `${symbol} - ${name}` : symbol;
});

const selectedAssetCategory = computed(() => {
    return props.item?.asset?.category || "";
});

const availableQuantity = computed(() => {
    return Number(
        props.item?.remaining_quantity ??
        props.item?.quantity ??
        0
    );
});

const availableQuantityDisplay = computed(() => {
    return availableQuantity.value.toLocaleString("id-ID", {
        maximumFractionDigits: 8,
    });
});

const availableLotsDisplay = computed(() => {
    const lots = availableQuantity.value / 100;
    return lots.toLocaleString("id-ID", {
        maximumFractionDigits: 2,
    });
});

watch(
    () => props.item,
    (val) => {
        form.current_price = val?.asset?.current_price ?? val?.current_price ?? "";
        form.close_quantity = "";
        form.close_price = "";
        form.close_fee = "";
        form.close_date = "";
        resetErrors();
    },
    { immediate: true }
);

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            form.current_price = props.item?.asset?.current_price ?? props.item?.current_price ?? "";
            form.close_quantity = "";
            form.close_price = "";
            form.close_fee = "";
            form.close_date = "";
            resetErrors();
        }
    }
);

function resetErrors() {
    errors.close_quantity = "";
    errors.close_price = "";
    errors.close_fee = "";
    errors.close_date = "";
}

function submit() {
    resetErrors();

    const hasPrice = form.current_price !== "" && Number(form.current_price) > 0;
    const hasPartialClose =
        form.close_quantity !== "" ||
        form.close_price !== "" ||
        form.close_fee !== "" ||
        form.close_date !== "";

    if (!hasPrice && !hasPartialClose) {
        toastService.error("Please fill at least one action.");
        return;
    }

    if (hasPartialClose) {
        const requestedQuantity = Number(form.close_quantity || 0);

        if (requestedQuantity <= 0) {
            errors.close_quantity = "Quantity must be greater than zero.";
        }

        if (requestedQuantity > availableQuantity.value) {
            errors.close_quantity = `Maximum close quantity is ${availableQuantityDisplay.value} shares.`;
        }

        if (Number(form.close_price || 0) <= 0) {
            errors.close_price = "Exit price must be greater than zero.";
        }

        if (Number(form.close_fee || 0) < 0) {
            errors.close_fee = "Sell fee cannot be negative.";
        }

        if (!form.close_date) {
            errors.close_date = "Exit date is required.";
        }
    }

    if (
        errors.close_quantity ||
        errors.close_price ||
        errors.close_fee ||
        errors.close_date
    ) {
        toastService.error("Please complete the form correctly.");
        return;
    }

    emit("submit", {
        current_price: hasPrice ? Number(form.current_price) : null,
        partial_close: hasPartialClose
            ? {
                quantity: Number(form.close_quantity),
                exit_price: Number(form.close_price),
                exit_fee: form.close_fee === "" ? 0 : Number(form.close_fee),
                exit_date: formatForBackend(form.close_date),
            }
            : null,
    });
}

function formatForBackend(value) {
    if (!value) return null;
    return value.replace("T", " ") + ":00";
}
</script>

<style scoped>
.modal-panel {
    border: 1px solid var(--modal-border);
    background: var(--modal-bg);
}

.modal-header {
    border-bottom: 1px solid var(--modal-border);
    flex-shrink: 0;
}

.modal-title {
    color: var(--modal-title);
}

.modal-close {
    border: 1px solid var(--modal-close-border);
    background: var(--modal-close-bg);
    color: var(--modal-close-text);
}

.modal-close:hover {
    color: var(--modal-close-hover-text);
}

.modal-body {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
}

.surface-soft {
    border: 1px solid var(--surface-soft-border);
    background: var(--surface-soft-bg);
}

.warning-soft {
    border: 1px solid rgba(251, 191, 36, 0.3);
    background: rgba(251, 191, 36, 0.08);
}

.warning-title {
    color: #fbbf24;
}

.alert-info {
    border: 1px solid var(--alert-info-border);
    background: var(--alert-info-bg);
    color: var(--alert-info-text);
}

.alert-info-strong {
    color: var(--alert-info-strong);
}

.page-title {
    color: var(--text-title);
}

.page-subtitle {
    color: var(--text-muted);
}

.page-body {
    color: var(--text-body);
}

:root[data-theme="light"] .warning-soft {
    border-color: rgba(217, 119, 6, 0.28);
    background: rgba(245, 158, 11, 0.1);
}

:root[data-theme="light"] .warning-title {
    color: #b45309;
}
</style>