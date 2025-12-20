"use client";

import * as React from "react";
import { Button } from "@nukleo/ui";
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react";

export type CalendarView = "month" | "week" | "day";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarView) => void;
  onCreateEvent: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onCreateEvent,
}: CalendarHeaderProps) {
  const formatTitle = () => {
    const options: Intl.DateTimeFormatOptions =
      view === "month"
        ? { month: "long", year: "numeric" }
        : view === "week"
        ? { month: "long", year: "numeric" }
        : { weekday: "long", day: "numeric", month: "long", year: "numeric" };

    return currentDate.toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left: Title and Navigation */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
          {formatTitle()}
        </h1>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            className="p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="sm" onClick={onNext} className="p-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right: View Switcher and Create Button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <Button
            variant={view === "month" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("month")}
          >
            Mois
          </Button>
          <Button
            variant={view === "week" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("week")}
          >
            Semaine
          </Button>
          <Button
            variant={view === "day" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("day")}
          >
            Jour
          </Button>
        </div>
        <Button variant="primary" onClick={onCreateEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel événement
        </Button>
      </div>
    </div>
  );
}
