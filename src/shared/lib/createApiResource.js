import { httpClient } from "../api/httpClient";

/**
 * Factory that produces a typed-ish CRUD client against a REST resource.
 * Returns an object with list/get/create/update/remove functions that unwrap
 * the `{ success, data }` envelope used by our BE.
 *
 * Usage:
 *   const appsApi = createApiResource("/api/runway/apps");
 *   await appsApi.list();
 *   await appsApi.get(id);
 *   await appsApi.create(body);
 *   await appsApi.update(id, patch);
 *   await appsApi.remove(id);
 */
export function createApiResource(basePath, { unwrap = true } = {}) {
  const pickData = (res) => (unwrap ? res.data?.data ?? res.data : res.data);

  return {
    list: async (params) => pickData(await httpClient.get(basePath, { params })),
    get: async (id) => pickData(await httpClient.get(`${basePath}/${id}`)),
    create: async (body) => pickData(await httpClient.post(basePath, body)),
    update: async (id, patch) =>
      pickData(await httpClient.patch(`${basePath}/${id}`, patch)),
    remove: async (id) => pickData(await httpClient.delete(`${basePath}/${id}`)),
    request: httpClient,
  };
}
