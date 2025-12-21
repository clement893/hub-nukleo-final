"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Clock,
  User,
  Building2,
  MessageSquare,
  Edit2,
  Trash2,
  Send,
  AlertCircle,
} from "lucide-react";
import {
  updateTicket,
  deleteTicket,
  addTicketComment,
  deleteTicketComment,
} from "../actions/tickets";
import type { TicketPriority, TicketStatus, TicketCategory } from "@nukleo/db";

type TicketData = {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  resolvedAt: Date | null;
  closedAt: Date | null;
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
  comments: Array<{
    id: string;
    content: string;
    isInternal: boolean;
    createdAt: Date;
    author: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  }>;
};

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  company: {
    id: string;
    name: string;
  } | null;
};

type Company = {
  id: string;
  name: string;
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

export default function TicketDetail({
  ticket,
  users,
  contacts,
  companies,
}: {
  ticket: TicketData;
  users: User[];
  contacts: Contact[];
  companies: Company[];
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editData, setEditData] = useState({
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    category: ticket.category,
    assignedToId: ticket.assignedTo?.id || "",
    contactId: ticket.contact?.id || "",
    companyId: ticket.company?.id || "",
    dueDate: ticket.dueDate ? format(new Date(ticket.dueDate), "yyyy-MM-dd") : "",
  });

  const [newComment, setNewComment] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(false);

  const handleSave = async () => {
    setError(null);
    try {
      const data: any = {
        title: editData.title,
        description: editData.description,
        priority: editData.priority,
        status: editData.status,
        category: editData.category,
        assignedToId: editData.assignedToId || null,
        contactId: editData.contactId || null,
        companyId: editData.companyId || null,
        dueDate: editData.dueDate ? new Date(editData.dueDate) : null,
      };

      await updateTicket(ticket.id, data);
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce ticket ?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTicket(ticket.id);
      router.push("/tickets");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsDeleting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSavingComment(true);
    setError(null);

    try {
      await addTicketComment({
        ticketId: ticket.id,
        content: newComment,
        isInternal: isInternalComment,
      });
      setNewComment("");
      setIsInternalComment(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSavingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    try {
      await deleteTicketComment(commentId, ticket.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* En-tête */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="text-2xl font-bold text-gray-900 w-full border-b-2 border-purple-500 focus:outline-none"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${priorityColors[isEditing ? editData.priority : ticket.priority]}`}
              >
                {isEditing ? (
                  <select
                    value={editData.priority}
                    onChange={(e) =>
                      setEditData({ ...editData, priority: e.target.value as TicketPriority })
                    }
                    className="bg-transparent border-none focus:outline-none"
                  >
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  priorityLabels[ticket.priority]
                )}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusColors[isEditing ? editData.status : ticket.status]}`}
              >
                {isEditing ? (
                  <select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value as TicketStatus })
                    }
                    className="bg-transparent border-none focus:outline-none"
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  statusLabels[ticket.status]
                )}
              </span>
              <span className="text-xs text-gray-500">
                {isEditing ? (
                  <select
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value as TicketCategory })
                    }
                    className="border border-gray-300 rounded px-2 py-0.5"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  categoryLabels[ticket.category]
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700"
                >
                  Enregistrer
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="prose max-w-none mb-4">
          {isEditing ? (
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows={6}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div>
            <div className="text-xs text-gray-500 mb-1">Créé par</div>
            <div className="text-sm font-medium text-gray-900">
              {ticket.createdBy.name || ticket.createdBy.email}
            </div>
            <div className="text-xs text-gray-500">
              {format(new Date(ticket.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Assigné à</div>
            {isEditing ? (
              <select
                value={editData.assignedToId}
                onChange={(e) => setEditData({ ...editData, assignedToId: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Non assigné</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm font-medium text-gray-900">
                {ticket.assignedTo ? ticket.assignedTo.name || ticket.assignedTo.email : "Non assigné"}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Contact</div>
            {isEditing ? (
              <select
                value={editData.contactId}
                onChange={(e) => setEditData({ ...editData, contactId: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Aucun</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm font-medium text-gray-900">
                {ticket.contact
                  ? `${ticket.contact.firstName} ${ticket.contact.lastName}`
                  : "Aucun"}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Entreprise</div>
            {isEditing ? (
              <select
                value={editData.companyId}
                onChange={(e) => setEditData({ ...editData, companyId: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Aucune</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm font-medium text-gray-900">
                {ticket.company ? ticket.company.name : "Aucune"}
              </div>
            )}
          </div>
        </div>

        {(ticket.dueDate || isEditing) && (
          <div className="pt-4 border-t mt-4">
            <div className="text-xs text-gray-500 mb-1">Date d'échéance</div>
            {isEditing ? (
              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              />
            ) : ticket.dueDate ? (
              <div
                className={`text-sm font-medium ${
                  new Date(ticket.dueDate) < new Date() ? "text-red-600" : "text-gray-900"
                }`}
              >
                {format(new Date(ticket.dueDate), "d MMMM yyyy", { locale: fr })}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Commentaires */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Commentaires ({ticket.comments.length})
        </h2>

        <div className="space-y-4 mb-6">
          {ticket.comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg ${
                comment.isInternal ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-900">
                    {comment.author.name || comment.author.email}
                  </div>
                  {comment.isInternal && (
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                      Interne
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">
                    {format(new Date(comment.createdAt), "d MMM yyyy à HH:mm", { locale: fr })}
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isInternalComment}
                onChange={(e) => setIsInternalComment(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              Commentaire interne (non visible par le client)
            </label>
            <button
              type="submit"
              disabled={isSavingComment || !newComment.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isSavingComment ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
