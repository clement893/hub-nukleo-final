"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./components/Sidebar";

export default function CommercialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullWidthPage = pathname?.includes("/opportunities");
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-all duration-300 overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 w-full overflow-hidden">
        <div className={`pt-16 lg:pt-0 ${isFullWidthPage ? 'p-0' : 'p-4 sm:p-6 lg:p-8'} max-w-full h-full overflow-hidden`}>
          <div className={`${isFullWidthPage ? 'max-w-full h-full' : 'max-w-7xl mx-auto h-full'}`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

