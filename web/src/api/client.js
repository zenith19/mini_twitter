import axios from "axios";

// The base URL used to be hard-coded as "http://localhost:3001" in a dozen
// components. It now comes from the environment, in one place.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Turns an axios error into a string a component can render. Previously every
// failure was swallowed by console.log and the user saw nothing.
export function errorMessage(error, fallback = "Something went wrong.") {
  const data = error?.response?.data;
  if (!data) return error?.message ?? fallback;
  if (typeof data === "string") return data;
  if (data.error) return data.error;
  if (data.errors) {
    return Object.values(data.errors).flat().join(", ");
  }
  return fallback;
}

export default client;
