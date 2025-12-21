import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTicket, getUsers, getContacts, getCompanies } from "../actions/tickets";
import TicketDetail from "./TicketDetail";

export const metadata = {
  title: "Détail du ticket - Nukleo Hub",
  description: "Détails et historique du ticket",
};

export default async function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [ticket, users, contacts, companies] = await Promise.all([
    getTicket(params.id),
    getUsers(),
    getContacts(),
    getCompanies(),
  ]);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux tickets
        </Link>

        <TicketDetail
          ticket={ticket}
          users={users}
          contacts={contacts}
          companies={companies}
        />
      </div>
    </div>
  );
}
