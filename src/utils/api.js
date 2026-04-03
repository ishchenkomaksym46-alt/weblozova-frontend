import axios from "axios";

const api = axios.create({
    baseURL: "https://lozova-history-backend.onrender.com"
});

export default api;
