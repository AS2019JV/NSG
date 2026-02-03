export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'development';
export const isProduction = APP_ENV === 'production';

export const CONFIG = {
    API_URL: isProduction 
        ? 'https://api.nsgintelligence.com' 
        : 'http://localhost:4000',
    APP_URL: isProduction
        ? 'https://nsgintelligence.com'
        : 'http://localhost:3000',
    // N8N Webhooks Base URL
    N8N_URL: (process.env.N8N_WEBHOOK || 'https://personal-n8n.suwsiw.easypanel.host/webhook').trim(),
};
