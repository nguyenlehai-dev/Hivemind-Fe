# Kiến trúc module cho Hivemind-Fe

## Mục đích

Tài liệu này mô tả cấu trúc feature-first của frontend: mỗi feature là một package độc lập trong `src/modules/`, dùng chung lớp `src/shared/` (HTTP client, UI primitive, icons) và `src/lib/` (cấu hình thư viện). Mục tiêu: thêm feature mới không đụng feature cũ, swap UI kit hoặc API base không đụng business component.

Song song với [BE](../../Hivemind-Be/docs/kien-truc-module.md): mỗi module BE thường có một module FE tương ứng (vd. `modules/runway` ↔ `modules/runway-custom`).

## Stack

| Layer | Công nghệ |
|---|---|
| Framework | React 18 + Vite 5 |
| Ngôn ngữ | JavaScript (chưa dùng TypeScript) |
| State local | React state / `useReducer` |
| State global | Zustand 5 (mỗi module tự khai store) |
| Server state | TanStack React Query 5 |
| HTTP | Axios (wrapper ở `shared/api/httpClient.js`) |
| Styling | Global CSS, class kebab-case |

Zustand + React Query + `httpClient` đã được wire sẵn nhưng **chưa có module nào dùng**. Tài liệu này là hướng dẫn cách "điền vào khung".

## Cấu trúc thư mục

```
src/
├── main.jsx                         # Entry: bọc QueryClientProvider
├── App.jsx                          # Root component, compose page/router
├── styles.css                       # Global CSS (color var, utility class)
├── lib/
│   └── queryClient.js               # QueryClient singleton
├── shared/                          # Tái sử dụng giữa các module
│   ├── api/
│   │   └── httpClient.js            # Axios instance, baseURL từ env
│   ├── ui/                          # UI primitive không phụ thuộc feature
│   │   └── ModalShell.jsx
│   └── icons/
│       └── index.jsx                # SVG icon export chung
├── modules/                         # Mỗi feature = 1 folder ở đây
│   └── runway-custom/
│       ├── RunwayCustomPage.jsx     # Entry page của feature
│       ├── api/                     # Gọi BE, 1 file/resource
│       ├── components/              # Component riêng của feature
│       ├── hooks/                   # Custom hook (wrap React Query, logic)
│       └── store/                   # Zustand store riêng của feature
└── components/                      # (hiếm dùng) Component toàn app không phải primitive
```

## Phân lớp

| Lớp | Trách nhiệm | Không được làm |
|---|---|---|
| `modules/<feature>/api/` | Gọi BE qua `httpClient`, trả raw data đã bóc envelope. | Chứa JSX, state UI. |
| `modules/<feature>/hooks/` | Wrap React Query / Zustand, expose hook cho component. | Gọi `axios` trực tiếp. |
| `modules/<feature>/store/` | Zustand store cho UI state của feature (modal mở/đóng, form draft...). | Lưu server state (để React Query lo). |
| `modules/<feature>/components/` | UI của feature, nhận props, dùng hook nội bộ. | Import component feature khác. |
| `modules/<feature>/<FeaturePage>.jsx` | Entry page, compose component + hook của feature. | Gọi API trực tiếp. |
| `shared/api/httpClient.js` | Axios instance duy nhất, baseURL + interceptor. | Biết về feature cụ thể. |
| `shared/ui/` | UI primitive (Modal, Button, Input...) — không phụ thuộc domain. | Gọi API, biết về module. |
| `lib/` | Cấu hình thư viện bên thứ 3 (QueryClient, i18n...). | Business logic. |

## HTTP client

`src/shared/api/httpClient.js`:

```js
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: false,
});
```

**Không được gọi `axios` trực tiếp trong component hoặc hook.** Luôn import `httpClient`.

Nếu cần auth header, request-id, hoặc log lỗi chung — thêm `httpClient.interceptors.request.use(...)` / `response.use(...)` trong chính file này. Không thêm interceptor trong module.

## Bóc envelope từ BE

BE trả response chuẩn (xem [Hivemind-Be/docs/kien-truc-module.md](../../Hivemind-Be/docs/kien-truc-module.md)):

```json
// Thành công (envelope)
{ "success": true, "data": { ... } }

// Thành công (flat — auth status, auth login)
{ "success": true, "status": "connected", "session_id": "..." }

// Lỗi
{ "success": false, "error": { "code": "job_not_found", "message": "Job not found" } }
```

**Bóc ở tầng `api/`, không bóc trong component.** Ví dụ:

```js
// modules/runway-custom/api/generationApi.js
import { httpClient } from "../../../shared/api/httpClient";

export async function createGeneration(payload) {
  const { data } = await httpClient.post("/api/runway/generations", payload);
  return data.data;   // envelope → trả payload thuần
}

export async function getGeneration(jobId) {
  const { data } = await httpClient.get(`/api/runway/generations/${jobId}`);
  return data.data;
}
```

Lỗi axios tự ném (status ≥ 400). Trong hook có thể `try/catch` lấy `err.response.data.error.code` để hiển thị thông điệp.

## API layer

Một file per resource trong `modules/<feature>/api/`:

```
modules/runway-custom/api/
├── authApi.js           # getAuthStatus, login, verifyOtp
├── assetApi.js          # uploadAsset
├── generationApi.js     # createGeneration, getGeneration
└── modelApi.js          # getModels
```

Quy tắc:
- Chỉ export **function async thuần** (không phải hook).
- Return dữ liệu đã bóc (`data.data` hoặc field flat).
- Không biết về React, không biết về store.

## Hooks layer

Hook wrap React Query hoặc logic phức tạp. Một file per resource:

```js
// modules/runway-custom/hooks/useGeneration.js
import { useMutation, useQuery } from "@tanstack/react-query";
import { createGeneration, getGeneration } from "../api/generationApi";

export function useCreateGeneration() {
  return useMutation({ mutationFn: createGeneration });
}

export function useGeneration(jobId) {
  return useQuery({
    queryKey: ["runway", "generation", jobId],
    queryFn: () => getGeneration(jobId),
    enabled: Boolean(jobId),
    refetchInterval: (q) =>
      q.state.data?.status === "completed" ? false : 1500,
  });
}
```

**Quy ước query key:** `[<module>, <resource>, ...params]`. Ví dụ `["runway", "generation", jobId]`. Nhờ đó invalidate theo module dễ.

## Store layer (Zustand)

Dùng cho **UI state** của feature (modal, wizard step, form draft, filter…). Server state để React Query.

```js
// modules/runway-custom/store/useRunwayUiStore.js
import { create } from "zustand";

export const useRunwayUiStore = create((set) => ({
  modelPickerOpen: false,
  selectedModelId: null,
  openModelPicker: () => set({ modelPickerOpen: true }),
  closeModelPicker: () => set({ modelPickerOpen: false }),
  selectModel: (id) => set({ selectedModelId: id, modelPickerOpen: false }),
}));
```

**Không dùng 1 store monolithic toàn app.** Mỗi module một hoặc vài store nhỏ theo phạm vi.

## Components

- **Feature component** ở `modules/<feature>/components/` — dùng hook/store nội bộ, nhận props.
- **Primitive dùng chung** ở `shared/ui/` — không biết về module, không gọi API.
- **Import chéo giữa module: cấm.** Nếu 2 module cần một component chung → chuyển lên `shared/ui/`.

## Routing

Hiện chưa có router. Khi thêm `react-router-dom`:

- Đặt route definition trong `src/router.jsx` (root).
- Mỗi module export `routes` từ `modules/<feature>/routes.jsx`, root router compose lại. Không để router biết chi tiết page.

## Biến môi trường

Dùng prefix `VITE_` (yêu cầu của Vite để expose sang client):

```
VITE_API_BASE_URL=http://localhost:8000
```

Đặt trong `.env.local` cho dev, `.env.production` cho build. **Không đọc `import.meta.env` rải rác** — đọc tập trung ở `shared/api/httpClient.js` hoặc file cấu hình riêng.

## Thêm module mới — checklist

Giả sử thêm feature `midjourney`:

1. **Tạo folder** `src/modules/midjourney/` với các thư mục con: `api/`, `components/`, `hooks/`, `store/`.
2. **Entry page** `MidjourneyPage.jsx` — compose component + hook của module.
3. **API** `api/<resource>Api.js` — function async, dùng `httpClient`, bóc envelope trả payload thuần.
4. **Hook** `hooks/use<Resource>.js` — wrap React Query với query key `["midjourney", "<resource>", ...]`.
5. **Store** `store/use<Feature>UiStore.js` — chỉ cho UI state, không cho server state.
6. **Component** `components/<Name>.jsx` — dùng hook/store nội bộ.
7. **Mount vào router** (hoặc `App.jsx` tạm thời nếu chưa có router).

Không chạm vào module khác. Không chạm `shared/` trừ khi thêm primitive dùng chung thật sự.

## Quy ước

- **Component: PascalCase** (`ShowcaseMediaCard.jsx`). File khớp tên export default.
- **Hook: camelCase, prefix `use`** (`useCreateGeneration.js`).
- **Store: camelCase, prefix `use` + suffix `Store`** (`useRunwayUiStore.js`).
- **API file: camelCase + suffix `Api`** (`generationApi.js`).
- **CSS class: kebab-case** (`showcase-card__media`). BEM được dùng trong `styles.css`.
- **Không barrel export (`index.js`)** — import trực tiếp file để tree-shake rõ ràng và tránh circular.
- **Không path alias** (hiện `vite.config.js` chưa có `resolve.alias`). Dùng relative import. Nếu muốn alias, cấu hình `@/` trong vite.config rồi document ở đây.
- **Không gọi `axios` trực tiếp.** Luôn qua `httpClient`.
- **Không đọc `import.meta.env` trong component.** Tập trung ở lớp config.
- **Server state: React Query.** UI state: Zustand. Form state: local `useState` (hoặc react-hook-form nếu phức tạp).

## Styling

Hiện dùng global CSS (`src/styles.css`, ~850 dòng, BEM + utility class). Khi feature lớn hơn:

- Tách file CSS theo module: `modules/<feature>/<feature>.css`, import trong page entry.
- Hoặc chuyển sang CSS Modules / Tailwind / styled-components — quyết định trước khi scale, document lại ở đây.

## Trạng thái hiện tại

| Thành phần | Trạng thái |
|---|---|
| Vite + React | Chạy được (`npm run dev`) |
| `httpClient` | Đã khai, **chưa có call nào** |
| React Query | Đã provider ở `main.jsx`, **chưa có query nào** |
| Zustand | Đã cài, **chưa có store nào** |
| `modules/runway-custom` | Landing page hardcoded, chưa integrate BE |
| Router | Chưa có, App render thẳng `RunwayCustomPage` |

## Lộ trình

- [ ] Viết `modules/runway-custom/api/*` cho 7 endpoint BE Runway.
- [ ] Viết hook React Query tương ứng, dùng trong `RunwayCustomPage`.
- [ ] Tách `RunwayCustomPage` (~340 dòng) thành component nhỏ hơn trong `components/`.
- [ ] Thêm `react-router-dom` khi có nhiều hơn 1 page.
- [ ] Bàn về strategy styling (CSS module / Tailwind) trước khi global CSS vượt 1500 dòng.
- [ ] Cân nhắc TypeScript khi API surface ổn định (giúp type envelope, request/response).
