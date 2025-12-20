"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages sans sidebar
  const pagesWithoutSidebar = ["/", "/login", "/setup-admin"];
  const shouldShowSidebar = !pagesWithoutSidebar.includes(pathname);

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-all duration-300">
      <Sidebar />
      <main className="flex-1 lg:ml-64 w-full">
        <div className="pt-16 lg:pt-0 p-4 lg:p-8 max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
