import { httpClient } from "../../../shared/api/httpClient";

export async function listGenerations() {
  const { data } = await httpClient.get("/api/runway/generations");
  return data.data;
}

export async function getGeneration(jobId) {
  const { data } = await httpClient.get(`/api/runway/generations/${jobId}`);
  return data.data;
}

export async function createGeneration(payload) {
  const { data } = await httpClient.post("/api/runway/generations", payload);
  return data.data;
}

export async function cancelGeneration(jobId) {
  await httpClient.delete(`/api/runway/generations/${jobId}`);
}

export async function retryGeneration(jobId) {
  const { data } = await httpClient.post(
    `/api/runway/generations/${jobId}/retry`,
  );
  return data.data;
}
