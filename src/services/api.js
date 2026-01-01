import axios from "axios";

// URL du backend Laravel sur InfinityFree
// export const API_URL = "https://05-electro.kesug.com/api";
export const API_URL = "https://05-electro.kesug.com/api-proxy.php";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // 🔑 nécessaire pour les cookies Sanctum
});

export default api;
