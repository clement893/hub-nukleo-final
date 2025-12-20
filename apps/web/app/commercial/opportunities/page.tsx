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
  "NEW",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const stageLabels: Record<OpportunityStage, string> = {
  NEW: "Nouvelle",
  QUALIFIED: "Qualifiée",
  PROPOSAL: "Proposition",
  NEGOTIATION: "Négociation",
  WON: "Gagnée",
  LOST: "Perdue",
};

const stageColors: Record<
  OpportunityStage,
  "default" | "primary" | "success" | "warning" | "error"
> = {
  NEW: "default",
  QUALIFIED: "primary",
  PROPOSAL: "primary",
  NEGOTIATION: "warning",
  WON: "success",
  LOST: "error",
};

interface Opportunity {
  id: string;
  title: string;
  description?: string | null;
  value?: number | null;
  stage: OpportunityStage;
  probability?: number | null;
  expectedCloseDate?: Date | null;
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
  const { setNodeRef } = useDroppable({
    id: stage,
  });

  const stageValue = opportunities.reduce(
    (sum, opp) => sum + (opp.value ? Number(opp.value) : 0),
    0
  );

  return (
    <div className="flex-shrink-0 w-80" ref={setNodeRef}>
      <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base text-gray-900 dark:text-white">{stageLabels[stage]}</CardTitle>
            <Badge variant={stageColors[stage]}>{opportunities.length}</Badge>
          </div>
          <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {stageValue.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 min-h-[200px]">
          <SortableContext
            items={opportunities.map((opp) => opp.id)}
            strategy={verticalListSortingStrategy}
          >
            {opportunities.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                Aucune opportunité
              </p>
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
    Array<{ id: string; firstName: string; lastName: string }>
  >([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingOpportunity, setEditingOpportunity] =
    React.useState<Opportunity | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    async function loadData() {
      try {
        const [oppsResult, compsResult, contsResult] = await Promise.all([
          getOpportunitiesAction(),
          getCompaniesForOpportunitiesAction(),
          getContactsForOpportunitiesAction(),
        ]);

        if (oppsResult.success && oppsResult.data) {
          setOpportunities(oppsResult.data);
        }

        if (compsResult.success && compsResult.data) {
          setCompanies(compsResult.data);
        }

        if (contsResult.success && contsResult.data) {
          setContacts(contsResult.data);
        }
      } catch (error) {
        logger.error("Error loading data", error instanceof Error ? error : new Error(String(error)));
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

    // Find the opportunity being dragged
    const activeOpportunity = opportunities.find((opp) => opp.id === activeId);
    if (!activeOpportunity) return;

    // Check if dropped on a stage column
    const targetStage = stages.find((stage) => stage === overId);
    if (targetStage && activeOpportunity.stage !== targetStage) {
      // Update the stage
      try {
        const result = await updateOpportunityStageAction(activeId, targetStage);
        if (result.success) {
          setOpportunities((prev) =>
            prev.map((opp) =>
              opp.id === activeId ? { ...opp, stage: targetStage } : opp
            )
          );
        }
      } catch (error) {
        logger.error("Error updating opportunity stage", error instanceof Error ? error : new Error(String(error)));
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
                    stage: data.stage as OpportunityStage, as OpportunityStage,
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
                      contacts.find((c) => c.id === data.contactId)?.firstName ||
                      "",
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
      NEW: [],
      QUALIFIED: [],
      PROPOSAL: [],
      NEGOTIATION: [],
      WON: [],
      LOST: [],
    };

    opportunities.forEach((opp) => {
      grouped[opp.stage].push(opp);
    });

    return grouped;
  }, [opportunities]);

  const activeOpportunity = activeId
    ? opportunities.find((opp) => opp.id === activeId)
    : null;

  if (isLoading) {
    return <p className="text-gray-500 dark:text-gray-400">Chargement...</p>;
  }

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
              Opportunités
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Gérez votre pipeline de vente</p>
          </div>
          <Button variant="primary" onClick={handleCreateOpportunity}>
            Nouvelle opportunité
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-4">
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
              <div className="opacity-50">
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
                  ? editingOpportunity.expectedCloseDate
                      .toISOString()
                      .split("T")[0]
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
