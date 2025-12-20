"use client";

import * as React from "react";
import { addMonths, addWeeks, addDays, subMonths, subWeeks, subDays } from "date-fns";
import { CalendarHeader, type CalendarView } from "./components/CalendarHeader";
import { MonthView } from "./components/MonthView";
import { WeekView } from "./components/WeekView";
import { DayView } from "./components/DayView";
import { EventModal } from "./components/EventModal";
import {
  getEventsAction,
  createEventAction,
  updateEventAction,
  deleteEventAction,
  getUsersForEventsAction,
  getOpportunitiesForEventsAction,
  getProjectsForEventsAction,
  getContactsForEventsAction,
  getCompaniesForEventsAction,
} from "./actions";
import { getUserAction } from "../components/get-user-action";

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<CalendarView>("month");
  const [events, setEvents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<any>(null);
  
  // Dropdown data
  const [users, setUsers] = React.useState<any[]>([]);
  const [opportunities, setOpportunities] = React.useState<any[]>([]);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [companies, setCompanies] = React.useState<any[]>([]);

  // Load user
  React.useEffect(() => {
    async function loadUser() {
      const result = await getUserAction();
      if (result.success && result.data) {
        setUser(result.data);
      }
    }
    loadUser();
  }, []);

  // Load dropdown data
  React.useEffect(() => {
    async function loadDropdownData() {
      const [usersResult, oppsResult, projectsResult, contactsResult, companiesResult] = await Promise.all([
        getUsersForEventsAction(),
        getOpportunitiesForEventsAction(),
        getProjectsForEventsAction(),
        getContactsForEventsAction(),
        getCompaniesForEventsAction(),
      ]);

      if (usersResult.success) setUsers(usersResult.data || []);
      if (oppsResult.success) setOpportunities(oppsResult.data || []);
      if (projectsResult.success) setProjects(projectsResult.data || []);
      if (contactsResult.success) setContacts(contactsResult.data || []);
      if (companiesResult.success) setCompanies(companiesResult.data || []);
    }

    loadDropdownData();
  }, []);

  // Load events
  React.useEffect(() => {
    async function loadEvents() {
      if (!user) return;

      setIsLoading(true);
      const result = await getEventsAction({
        userId: user.id,
      });

      if (result.success && result.data) {
        setEvents(result.data);
      }
      setIsLoading(false);
    }

    loadEvents();
  }, [user]);

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: any) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDayClick = (date: Date) => {
    // Switch to day view for the clicked date
    setCurrentDate(date);
    setView("day");
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    // Open modal with pre-filled date and time
    const startDate = new Date(date);
    startDate.setHours(hour, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(hour + 1, 0, 0, 0);

    setEditingEvent({
      startDate,
      endDate,
      allDay: false,
    });
    setIsModalOpen(true);
  };

  const handleDayTimeSlotClick = (hour: number) => {
    // Open modal with pre-filled date and time
    const startDate = new Date(currentDate);
    startDate.setHours(hour, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(hour + 1, 0, 0, 0);

    setEditingEvent({
      startDate,
      endDate,
      allDay: false,
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: any) => {
    if (!user) return;

    if (editingEvent?.id) {
      // Update existing event
      const result = await updateEventAction(editingEvent.id, data, user.id);
      if (result.success) {
        // Reload events
        const eventsResult = await getEventsAction({ userId: user.id });
        if (eventsResult.success && eventsResult.data) {
          setEvents(eventsResult.data);
        }
      }
    } else {
      // Create new event
      const result = await createEventAction(data, user.id);
      if (result.success) {
        // Reload events
        const eventsResult = await getEventsAction({ userId: user.id });
        if (eventsResult.success && eventsResult.data) {
          setEvents(eventsResult.data);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Chargement du calendrier...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
        onCreateEvent={handleCreateEvent}
      />

      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          events={events}
          onEventClick={handleEventClick}
          onDayClick={handleDayClick}
        />
      )}

      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventClick={handleEventClick}
          onTimeSlotClick={handleTimeSlotClick}
        />
      )}

      {view === "day" && (
        <DayView
          currentDate={currentDate}
          events={events}
          onEventClick={handleEventClick}
          onTimeSlotClick={handleDayTimeSlotClick}
        />
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingEvent}
        users={users}
        opportunities={opportunities}
        projects={projects}
        contacts={contacts}
        companies={companies}
      />
    </div>
  );
}
