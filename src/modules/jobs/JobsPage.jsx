import AppShell from "../../shared/ui/AppShell";
import JobsContent from "./JobsContent";

export default function JobsPage() {
  return (
    <AppShell className="jobs-page" withSidebar>
      <JobsContent />
    </AppShell>
  );
}
