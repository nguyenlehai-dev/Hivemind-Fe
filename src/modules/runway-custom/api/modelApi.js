import { httpClient } from "../../../shared/api/httpClient";

export async function listModels(mode = "image") {
  const { data } = await httpClient.get("/api/runway/models", {
    params: { mode },
  });
  return data.data;
}
