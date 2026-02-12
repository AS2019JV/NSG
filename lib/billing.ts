import api from "./api";

export interface SubscriptionStatus {
    status: "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "none";
    plan: "free" | "estratega" | "enterprise";
    current_period_end?: string;
}

export const billingService = {
    /**
     * Inicia el flujo de pago con Stripe
     */
    async createCheckoutSession(priceId: string) {
        const response = await api.post<{ url: string }>("/billing/create-checkout-session", {
            priceId,
        });
        return response.data;
    },

    /**
     * Obtiene el estado de la suscripción
     */
    async getSubscriptionStatus() {
        const response = await api.get<SubscriptionStatus>("/billing/subscription-status");
        return response.data;
    },
};
