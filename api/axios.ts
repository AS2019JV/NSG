import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK || process.env.N8N_WEBHOOK;

const instance = axios.create({
    baseURL: API_BASE_URL
});

export default instance;
