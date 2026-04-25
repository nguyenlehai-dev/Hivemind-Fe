import { httpClient } from "../../../shared/api/httpClient";

export async function getAuthStatus() {
  const { data } = await httpClient.get("/api/runway/auth/status");
  return data;
}

export async function login({ email, password }) {
  const { data } = await httpClient.post("/api/runway/auth/login", {
    email,
    password,
  });
  return data;
}

export async function verifyOtp({ session_id, otp_code }) {
  const { data } = await httpClient.post("/api/runway/auth/verify-otp", {
    session_id,
    otp_code,
  });
  return data;
}

export async function disconnect() {
  const { data } = await httpClient.post("/api/runway/auth/disconnect");
  return data;
}
