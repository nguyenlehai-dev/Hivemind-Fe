import { httpClient } from "../../../shared/api/httpClient";

export async function listApps() {
  const { data } = await httpClient.get("/api/runway/apps");
  return data.data;
}

export async function getApp(appId) {
  const { data } = await httpClient.get(`/api/runway/apps/${appId}`);
  return data.data;
}

export async function createApp(payload) {
  const { data } = await httpClient.post("/api/runway/apps", payload);
  return data.data;
}

export async function updateApp(appId, patch) {
  const { data } = await httpClient.patch(
    `/api/runway/apps/${appId}`,
    patch,
  );
  return data.data;
}

export async function deleteApp(appId) {
  await httpClient.delete(`/api/runway/apps/${appId}`);
}

export async function runApp(appId, overrides) {
  const { data } = await httpClient.post(
    `/api/runway/apps/${appId}/run`,
    overrides ?? {},
  );
  return data.data;
}
