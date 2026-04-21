import { httpClient } from "../../../shared/api/httpClient";

export async function getCapabilities() {
  const { data } = await httpClient.get("/api/runway/capabilities");
  return data.data;
}
