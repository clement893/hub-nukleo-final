"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  User,
  Building2,
  Filter,
} from "lucide-react";
import type { TicketPriority, TicketStatus, TicketCategory } from "@nukleo/db";

type Ticket = {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  createdAt: Date;
  dueDate: Date | null;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  assignedTo: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
  } | null;
  company: {
    id: string;
    name: string;
  } | null;
  _count: {
    comments: number;
  };
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

const priorityLabels = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
};

const statusColors = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  WAITING_CUSTOMER: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-700",
};

const statusLabels = {
  OPEN: "Ouvert",
  IN_PROGRESS: "En cours",
  WAITING_CUSTOMER: "En attente client",
  RESOLVED: "Résolu",
  CLOSED: "Fermé",
};

const categoryLabels = {
  BUG: "Bug",
  FEATURE_REQUEST: "Demande de fonctionnalité",
  QUESTION: "Question",
  TECHNICAL_ISSUE: "Problème technique",
  BILLING: "Facturation",
  OTHER: "Autre",
};

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "ALL">("ALL");

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== "ALL" && ticket.status !== statusFilter) return false;
    if (priorityFilter !== "ALL" && ticket.priority !== priorityFilter) return false;
    if (categoryFilter !== "ALL" && ticket.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filtres</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "ALL")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="ALL">Tous les statuts</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | "ALL")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="ALL">Toutes les priorités</option>
              {Object.entries(priorityLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | "ALL")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="ALL">Toutes les catégories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des tickets */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Aucun ticket trouvé</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {ticket.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityColors[ticket.priority]}`}
                    >
                      {priorityLabels[ticket.priority]}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[ticket.status]}`}
                    >
                      {statusLabels[ticket.status]}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {ticket.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(ticket.createdAt), "d MMM yyyy", {
                        locale: fr,
                      })}
                    </div>

                    {ticket.assignedTo && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {ticket.assignedTo.name || ticket.assignedTo.email}
                      </div>
                    )}

                    {ticket.contact && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {ticket.contact.firstName} {ticket.contact.lastName}
                      </div>
                    )}

                    {ticket.company && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {ticket.company.name}
                      </div>
                    )}

                    {ticket._count.comments > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {ticket._count.comments}
                      </div>
                    )}

                    <span className="text-gray-400">•</span>
                    <span>{categoryLabels[ticket.category]}</span>
                  </div>
                </div>

                {ticket.dueDate && (
                  <div className="flex-shrink-0">
                    <div
                      className={`text-xs ${
                        new Date(ticket.dueDate) < new Date()
                          ? "text-red-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      Échéance: {format(new Date(ticket.dueDate), "d MMM", { locale: fr })}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
