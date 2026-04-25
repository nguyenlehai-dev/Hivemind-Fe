import AppShell from "../../shared/ui/AppShell";
import CustomWorkflowContent from "./CustomWorkflowContent";

export default function CustomWorkflowPage() {
  return (
    <AppShell className="custom-page" withSidebar>
      <CustomWorkflowContent />
    </AppShell>
  );
}
