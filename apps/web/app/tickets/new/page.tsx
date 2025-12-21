import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getUsers, getContacts, getCompanies } from "../actions/tickets";
import CreateTicketForm from "../components/CreateTicketForm";

export const metadata = {
  title: "Nouveau ticket - Nukleo Hub",
  description: "Créer un nouveau ticket de support",
};

export default async function NewTicketPage() {
  const [users, contacts, companies] = await Promise.all([
    getUsers(),
    getContacts(),
    getCompanies(),
  ]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux tickets
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouveau ticket</h1>
          <CreateTicketForm users={users} contacts={contacts} companies={companies} />
        </div>
      </div>
    </div>
  );
}
