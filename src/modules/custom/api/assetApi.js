import { httpClient } from "../../../shared/api/httpClient";

export async function uploadAsset(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await httpClient.post("/api/runway/assets/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}
