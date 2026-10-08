import axios from "axios";
import * as SecureStore from "expo-secure-store";

console.log("URL API :", process.env.EXPO_PUBLIC_API_URL);

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");

    console.log("TOKEN ENVOYÉ :", token ? "OUI" : "NON");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);