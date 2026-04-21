import { createBrowserRouter } from "react-router-dom";

import AppDetailPage from "./modules/apps/AppDetailPage";
import AppsPage from "./modules/apps/AppsPage";
import CustomWorkflowPage from "./modules/runway-custom/CustomWorkflowPage";
import JobsPage from "./modules/jobs/JobsPage";
import RunwayCustomPage from "./modules/runway-custom/RunwayCustomPage";
import NotFoundPage from "./shared/ui/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <RunwayCustomPage /> },
  { path: "/custom", element: <CustomWorkflowPage /> },
  { path: "/jobs", element: <JobsPage /> },
  { path: "/apps", element: <AppsPage /> },
  { path: "/apps/:appId", element: <AppDetailPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
