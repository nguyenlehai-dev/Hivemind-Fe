import { useNavigate, useParams } from "react-router-dom";

import AppShell from "../../shared/ui/AppShell";
import AppDangerZone from "./components/detail/AppDangerZone";
import AppDetailHeader from "./components/detail/AppDetailHeader";
import AppEditSection from "./components/detail/AppEditSection";
import AppRunSection from "./components/detail/AppRunSection";
import { useApp } from "./hooks/useApps";

export default function AppDetailPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { data: app, isLoading, isError, error } = useApp(appId);

  return (
    <AppShell className="apps-page" withSidebar>
      <div className="apps-main">
        <div className="apps-container">
          <AppDetailHeader
            app={app}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />

          {app && (
            <>
              <AppRunSection app={app} onNavigateJobs={() => navigate("/jobs")} />
              <AppEditSection app={app} />
              <AppDangerZone app={app} onDeleted={() => navigate("/apps")} />
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
