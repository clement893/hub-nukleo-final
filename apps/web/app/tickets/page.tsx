import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getTickets } from "./actions/tickets";
import TicketList from "./components/TicketList";

export const metadata = {
  title: "Tickets - Nukleo Hub",
  description: "Gestion des tickets de support",
};

export default async function TicketsPage() {
  const tickets = await getTickets();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gérez vos tickets de support et demandes clients
            </p>
          </div>
          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            Nouveau ticket
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Chargement...</p>
            </div>
          }
        >
          <TicketList tickets={tickets} />
        </Suspense>
      </div>
    </div>
  );
}
