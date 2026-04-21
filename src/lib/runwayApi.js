import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: false,
});

export async function getAuthStatus() {
  const { data } = await http.get("/api/runway/auth/status");
  return data;
}

export async function loginRunway(payload) {
  const { data } = await http.post("/api/runway/auth/login", payload);
  return data;
}

export async function verifyOtp(payload) {
  const { data } = await http.post("/api/runway/auth/verify-otp", payload);
  return data;
}

export async function getModels(mode = "image") {
  const { data } = await http.get(`/api/runway/models?mode=${mode}`);
  return data;
}

export async function uploadAsset(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await http.post("/api/runway/assets/upload", formData);
  return data;
}

export async function createGeneration(payload) {
  const { data } = await http.post("/api/runway/generations", payload);
  return data;
}

export async function getGeneration(jobId) {
  const { data } = await http.get(`/api/runway/generations/${jobId}`);
  return data;
}
