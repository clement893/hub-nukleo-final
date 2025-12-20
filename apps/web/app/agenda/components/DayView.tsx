"use client";

import * as React from "react";
import { format, isSameDay } from "date-fns";

interface Event {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  type: string;
  location?: string | null;
  color?: string | null;
}

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onTimeSlotClick: (hour: number) => void;
}

export function DayView({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventHour = eventStart.getHours();
      
      return isSameDay(eventStart, currentDate) && eventHour === hour;
    });
  };

  const allDayEvents = events.filter(
    (event) => event.allDay && isSameDay(new Date(event.startDate), currentDate)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Toute la journée
          </div>
          <div className="space-y-2">
            {allDayEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: event.color || "#6B5DD3",
                  color: "white",
                }}
                onClick={() => onEventClick(event)}
              >
                <div className="font-medium">{event.title}</div>
                {event.location && (
                  <div className="text-sm opacity-90 mt-1">
                    📍 {event.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time slots */}
      <div className="overflow-y-auto max-h-[700px]">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div
              key={hour}
              className="flex border-b border-gray-200 dark:border-gray-700"
            >
              {/* Hour label */}
              <div className="w-20 p-3 text-sm text-gray-500 dark:text-gray-400 text-right border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                {hour.toString().padStart(2, "0")}:00
              </div>

              {/* Events column */}
              <div
                className="flex-1 min-h-[80px] p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                onClick={() => onTimeSlotClick(hour)}
              >
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: event.color || "#6B5DD3",
                      color: "white",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-sm opacity-90">
                        {format(new Date(event.startDate), "HH:mm")} -{" "}
                        {format(new Date(event.endDate), "HH:mm")}
                      </div>
                    </div>
                    {event.description && (
                      <div className="text-sm opacity-90 mb-2">
                        {event.description}
                      </div>
                    )}
                    {event.location && (
                      <div className="text-sm opacity-90">
                        📍 {event.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
