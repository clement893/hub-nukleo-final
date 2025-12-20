"use client";

import * as React from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { fr } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  type: string;
  color?: string | null;
}

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
}

export function WeekView({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const eventHour = eventStart.getHours();
      
      return isSameDay(eventStart, day) && eventHour === hour;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <div className="p-3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"></div>
        {days.map((day) => {
          const isCurrentDay = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className="p-3 text-center border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                {format(day, "EEE", { locale: fr })}
              </div>
              <div
                className={`text-lg font-semibold mt-1 ${
                  isCurrentDay
                    ? "bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="overflow-y-auto max-h-[600px]">
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700"
          >
            {/* Hour label */}
            <div className="p-2 text-xs text-gray-500 dark:text-gray-400 text-right border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              {hour.toString().padStart(2, "0")}:00
            </div>

            {/* Day columns */}
            {days.map((day) => {
              const dayEvents = getEventsForDayAndHour(day, hour);
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="min-h-[60px] p-1 border-r border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => onTimeSlotClick(day, hour)}
                >
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: event.color || "#6B5DD3",
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-[10px] opacity-90">
                        {format(new Date(event.startDate), "HH:mm")} -{" "}
                        {format(new Date(event.endDate), "HH:mm")}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
