import AuthModal from "../../modules/custom/components/AuthModal";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Toaster from "./Toaster";

export default function AppShell({
  children,
  headerVariant = "light",
  withSidebar = false,
  className = "",
  navItems,
  onOpenWorkflow,
}) {
  const rootClass = `app-shell ${withSidebar ? "app-shell--with-sidebar" : ""} ${className}`.trim();

  return (
    <div className={rootClass}>
      <AppHeader
        variant={headerVariant}
        showNav={!withSidebar}
        navItems={navItems}
        onOpenWorkflow={onOpenWorkflow}
      />
      {withSidebar ? (
        <div className="app-shell__layout">
          <AppSidebar />
          <main className="app-shell__main app-shell__main--with-sidebar">
            {children}
          </main>
        </div>
      ) : (
        <main className="app-shell__main">{children}</main>
      )}
      <AppFooter />
      <AuthModal />
      <Toaster />
    </div>
  );
}
