import { Sidebar } from "./components/Sidebar";

export default function CommercialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar />
      <main className="flex-1 lg:ml-64 w-full">
        <div className="pt-16 lg:pt-0 p-4 lg:p-8 max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

