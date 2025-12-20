"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
} from "@nukleo/ui";
import {
  OpportunityCard,
  OpportunityModal,
} from "@nukleo/commercial/client";
import type { OpportunityFormData } from "@nukleo/commercial/client";
import type { OpportunityStage } from "@nukleo/db/types";
import {
  getOpportunitiesAction,
  getCompaniesForOpportunitiesAction,
  getContactsForOpportunitiesAction,
  updateOpportunityStageAction,
  createOpportunityAction,
  updateOpportunityAction,
} from "./actions";
import { logger } from "@/lib/logger";

const stages: OpportunityStage[] = [
  "IDEAS_CONTACT_PROJECT",
  "FOLLOW_UP_EMAILS",
  "MEETING_BOOKED",
  "IN_DISCUSSION",
  "PROPOSAL_TO_DO",
  "PROPOSAL_SENT",
  "CONTRACT_TO_DO",
  "CLOSED_WON",
  "CLOSED_LOST",
  "RENEWALS_POTENTIAL_UPCOMING",
  "WAITING_OR_SILENT",
];

const stageLabels: Record<OpportunityStage, string> = {
  IDEAS_CONTACT_PROJECT: "💡 Idées",
  FOLLOW_UP_EMAILS: "📧 Relances",
  MEETING_BOOKED: "📅 RDV planifié",
  IN_DISCUSSION: "💬 Discussion",
  PROPOSAL_TO_DO: "📝 Proposition à faire",
  PROPOSAL_SENT: "📤 Proposition envoyée",
  CONTRACT_TO_DO: "📄 Contrat à faire",
  CLOSED_WON: "✅ Gagnée",
  CLOSED_LOST: "❌ Perdue",
  RENEWALS_POTENTIAL_UPCOMING: "🔄 Renouvellements",
  WAITING_OR_SILENT: "⏸️ En attente",
};

// Couleurs améliorées avec le thème Nukleo
const stageGradients: Record<OpportunityStage, string> = {
  IDEAS_CONTACT_PROJECT: "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700",
  FOLLOW_UP_EMAILS: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30",
  MEETING_BOOKED: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30",
  IN_DISCUSSION: "from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30",
  PROPOSAL_TO_DO: "from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30",
  PROPOSAL_SENT: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30",
  CONTRACT_TO_DO: "from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30",
  CLOSED_WON: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30",
  CLOSED_LOST: "from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30",
  RENEWALS_POTENTIAL_UPCOMING: "from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30",
  WAITING_OR_SILENT: "from-slate-100 to-slate-200 dark:from-slate-800/30 dark:to-slate-700/30",
};

const stageBorderColors: Record<OpportunityStage, string> = {
  IDEAS_CONTACT_PROJECT: "border-gray-300 dark:border-gray-600",
  FOLLOW_UP_EMAILS: "border-blue-300 dark:border-blue-700",
  MEETING_BOOKED: "border-purple-300 dark:border-purple-700",
  IN_DISCUSSION: "border-indigo-300 dark:border-indigo-700",
  PROPOSAL_TO_DO: "border-yellow-300 dark:border-yellow-700",
  PROPOSAL_SENT: "border-orange-300 dark:border-orange-700",
  CONTRACT_TO_DO: "border-amber-300 dark:border-amber-700",
  CLOSED_WON: "border-green-300 dark:border-green-700",
  CLOSED_LOST: "border-red-300 dark:border-red-700",
  RENEWALS_POTENTIAL_UPCOMING: "border-teal-300 dark:border-teal-700",
  WAITING_OR_SILENT: "border-slate-300 dark:border-slate-600",
};

const stageColors: Record<
  OpportunityStage,
  "default" | "primary" | "success" | "warning" | "error"
> = {
  IDEAS_CONTACT_PROJECT: "default",
  FOLLOW_UP_EMAILS: "primary",
  MEETING_BOOKED: "primary",
  IN_DISCUSSION: "primary",
  PROPOSAL_TO_DO: "warning",
  PROPOSAL_SENT: "warning",
  CONTRACT_TO_DO: "warning",
  CLOSED_WON: "success",
  CLOSED_LOST: "error",
  RENEWALS_POTENTIAL_UPCOMING: "default",
  WAITING_OR_SILENT: "default",
};

interface Opportunity {
  id: string;
  title: string;
  description?: string | null;
  value?: number | null;
  stage: OpportunityStage;
  probability?: number | null;
  openDate?: Date | null;
  expectedCloseDate?: Date | null;
  actualCloseDate?: Date | null;
  company?: { id: string; name: string } | null;
  contact?: { id: string; firstName: string; lastName: string } | null;
}

interface SortableOpportunityCardProps {
  opportunity: Opportunity;
  onClick: () => void;
}

function SortableOpportunityCard({
  opportunity,
  onClick,
}: SortableOpportunityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: opportunity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OpportunityCard
        id={opportunity.id}
        title={opportunity.title}
        company={opportunity.company?.name}
        contact={opportunity.contact}
        value={opportunity.value ? Number(opportunity.value) : undefined}
        probability={opportunity.probability ?? undefined}
        expectedCloseDate={opportunity.expectedCloseDate ?? undefined}
        stage={opportunity.stage}
        onClick={onClick}
      />
    </div>
  );
}

interface KanbanColumnProps {
  stage: OpportunityStage;
  opportunities: Opportunity[];
  onOpportunityClick: (opportunity: Opportunity) => void;
}

function KanbanColumn({
  stage,
  opportunities,
  onOpportunityClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  const stageValue = opportunities.reduce(
    (sum, opp) => sum + (opp.value ? Number(opp.value) : 0),
    0
  );

  return (
    <div className="flex-shrink-0 w-80" ref={setNodeRef}>
      <Card 
        className={`h-full transition-all duration-200 ${
          isOver 
            ? 'ring-2 ring-primary shadow-lg scale-[1.02]' 
            : 'shadow-md hover:shadow-lg'
        } bg-gradient-to-br ${stageGradients[stage]} border-2 ${stageBorderColors[stage]}`}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-base font-bold text-gray-900 dark:text-white leading-tight">
              {stageLabels[stage]}
            </CardTitle>
            <Badge variant={stageColors[stage]} className="shrink-0">
              {opportunities.length}
            </Badge>
          </div>
          <CardDescription className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">
            {stageValue.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 min-h-[300px] max-h-[calc(100vh-300px)] overflow-y-auto">
          <SortableContext
            items={opportunities.map((opp) => opp.id)}
            strategy={verticalListSortingStrategy}
          >
            {opportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-2 opacity-30">📭</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune opportunité
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Glissez-déposez ici
                </p>
              </div>
            ) : (
              opportunities.map((opportunity) => (
                <SortableOpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onClick={() => onOpportunityClick(opportunity)}
                />
              ))
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([]);
  const [companies, setCompanies] = React.useState<
    Array<{ id: string; name: string }>
  >([]);
  const [contacts, setContacts] = React.useState<
    Array<{ id: string; firstName: string | null; lastName: string | null }>
  >([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingOpportunity, setEditingOpportunity] =
    React.useState<Opportunity | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    async function loadData() {
      try {
        const [oppsResult, companiesResult, contactsResult] = await Promise.all([
          getOpportunitiesAction(),
          getCompaniesForOpportunitiesAction(),
          getContactsForOpportunitiesAction(),
        ]);

        if (oppsResult.success && oppsResult.data) {
          setOpportunities(
            oppsResult.data.map((opp: any) => ({
              ...opp,
              value: opp.value ? Number(opp.value) : null,
            }))
          );
        }

        if (companiesResult.success && companiesResult.data) {
          setCompanies(companiesResult.data);
        }

        if (contactsResult.success && contactsResult.data) {
          setContacts(contactsResult.data);
        }
      } catch (error) {
        logger.error("Error loading opportunities data", error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeOpportunity = opportunities.find((opp) => opp.id === activeId);
    if (!activeOpportunity) return;

    // Check if dropped on a stage column
    const targetStage = stages.find((s) => s === overId);
    if (targetStage && activeOpportunity.stage !== targetStage) {
      const result = await updateOpportunityStageAction(activeId, targetStage);

      if (result.success) {
        setOpportunities((prev) =>
          prev.map((opp) =>
            opp.id === activeId ? { ...opp, stage: targetStage } : opp
          )
        );
      }
      return;
    }

    // Check if dropped on another opportunity (reordering within same stage)
    const overOpportunity = opportunities.find((opp) => opp.id === overId);
    if (overOpportunity && activeOpportunity.stage === overOpportunity.stage) {
      const oldIndex = opportunities.findIndex((opp) => opp.id === activeId);
      const newIndex = opportunities.findIndex((opp) => opp.id === overId);

      setOpportunities((prev) => arrayMove(prev, oldIndex, newIndex));
      return;
    }
  };

  const handleCreateOpportunity = () => {
    setEditingOpportunity(null);
    setIsModalOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: OpportunityFormData) => {
    try {
      if (editingOpportunity) {
        const result = await updateOpportunityAction(editingOpportunity.id, {
          title: data.title,
          description: data.description,
          value: data.value,
          stage: data.stage as OpportunityStage,
          probability: data.probability,
          expectedCloseDate: data.expectedCloseDate,
          companyId: data.companyId,
          contactId: data.contactId,
        });

        if (result.success) {
          setOpportunities((prev) =>
            prev.map((opp) =>
              opp.id === editingOpportunity.id
                ? {
                    ...opp,
                    title: data.title,
                    description: data.description,
                    value: data.value ?? null,
                    stage: data.stage,
                    probability: data.probability,
                    expectedCloseDate: data.expectedCloseDate
                      ? new Date(data.expectedCloseDate)
                      : null,
                    company: companies.find((c) => c.id === data.companyId)
                      ? {
                          id: data.companyId!,
                          name:
                            companies.find((c) => c.id === data.companyId)
                              ?.name || "",
                        }
                      : null,
                    contact: contacts.find((c) => c.id === data.contactId)
                      ? {
                          id: data.contactId!,
                          firstName:
                            contacts.find((c) => c.id === data.contactId)
                              ?.firstName || "",
                          lastName:
                            contacts.find((c) => c.id === data.contactId)
                              ?.lastName || "",
                        }
                      : null,
                  }
                : opp
            )
          );
        }
      } else {
        const result = await createOpportunityAction({
          title: data.title,
          description: data.description,
          value: data.value,
          stage: data.stage as OpportunityStage,
          probability: data.probability,
          expectedCloseDate: data.expectedCloseDate,
          companyId: data.companyId,
          contactId: data.contactId,
        });

        if (result.success && result.data) {
          setOpportunities((prev) => [
            {
              id: result.data!.id,
              title: result.data!.title,
              description: result.data!.description,
              value: result.data!.value ? Number(result.data!.value) : null,
              stage: result.data!.stage,
              probability: result.data!.probability,
              expectedCloseDate: result.data!.expectedCloseDate,
              company: companies.find((c) => c.id === data.companyId)
                ? {
                    id: data.companyId!,
                    name:
                      companies.find((c) => c.id === data.companyId)?.name ||
                      "",
                  }
                : null,
              contact: contacts.find((c) => c.id === data.contactId)
                ? {
                    id: data.contactId!,
                    firstName:
                      contacts.find((c) => c.id === data.contactId)
                        ?.firstName || "",
                    lastName:
                      contacts.find((c) => c.id === data.contactId)?.lastName ||
                      "",
                  }
                : null,
            },
            ...prev,
          ]);
        }
      }

      setIsModalOpen(false);
      setEditingOpportunity(null);
    } catch (error) {
      logger.error("Error saving opportunity", error instanceof Error ? error : new Error(String(error)));
    }
  };

  const opportunitiesByStage = React.useMemo(() => {
    const grouped: Record<OpportunityStage, Opportunity[]> = {
      IDEAS_CONTACT_PROJECT: [],
      FOLLOW_UP_EMAILS: [],
      MEETING_BOOKED: [],
      IN_DISCUSSION: [],
      PROPOSAL_TO_DO: [],
      PROPOSAL_SENT: [],
      CONTRACT_TO_DO: [],
      CLOSED_WON: [],
      CLOSED_LOST: [],
      RENEWALS_POTENTIAL_UPCOMING: [],
      WAITING_OR_SILENT: [],
    };

    opportunities.forEach((opp) => {
      grouped[opp.stage].push(opp);
    });

    return grouped;
  }, [opportunities]);

  const activeOpportunity = activeId
    ? opportunities.find((opp) => opp.id === activeId)
    : null;

  const totalValue = opportunities.reduce(
    (sum, opp) => sum + (opp.value ? Number(opp.value) : 0),
    0
  );

  const totalOpportunities = opportunities.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Chargement du pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-2">
              Pipeline de vente
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Gérez vos opportunités par glisser-déposer
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={handleCreateOpportunity} 
            className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
          >
            ➕ Nouvelle opportunité
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {totalOpportunities}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Opportunités actives
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {totalValue.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                })}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Valeur totale du pipeline
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {opportunitiesByStage.CLOSED_WON.length}
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                Opportunités gagnées
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 min-w-max pb-6">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                opportunities={opportunitiesByStage[stage]}
                onOpportunityClick={handleEditOpportunity}
              />
            ))}
          </div>
        </div>
        <DragOverlay>
          {activeOpportunity ? (
            <div className="opacity-80 rotate-3 scale-105">
              <OpportunityCard
                id={activeOpportunity.id}
                title={activeOpportunity.title}
                company={activeOpportunity.company?.name}
                contact={activeOpportunity.contact}
                value={
                  activeOpportunity.value
                    ? Number(activeOpportunity.value)
                    : undefined
                }
                probability={activeOpportunity.probability ?? undefined}
                expectedCloseDate={
                  activeOpportunity.expectedCloseDate ?? undefined
                }
                stage={activeOpportunity.stage}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOpportunity(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={
          editingOpportunity
            ? {
                title: editingOpportunity.title,
                description: editingOpportunity.description || undefined,
                value: editingOpportunity.value ?? undefined,
                stage: editingOpportunity.stage,
                probability: editingOpportunity.probability ?? undefined,
                expectedCloseDate: editingOpportunity.expectedCloseDate
                  ? new Date(editingOpportunity.expectedCloseDate)
                  : undefined,
                companyId: editingOpportunity.company?.id,
                contactId: editingOpportunity.contact?.id,
              }
            : undefined
        }
        companies={companies}
        contacts={contacts}
      />
    </>
  );
}
