"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@nukleo/ui";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { getCurrentUserAction } from "./get-user-action";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

// Navigation items for Commercial Module
const commercialNavigation: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/commercial/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    title: "Opportunités",
    href: "/commercial/opportunities",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Contacts",
    href: "/commercial/contacts",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    title: "Statistiques",
    href: "/commercial/contacts/stats",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Entreprises",
    href: "/commercial/companies",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    title: "Soumissions",
    href: "/commercial/proposals",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
  },
];

// Navigation items for Operations Module
const operationsNavigation: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/operations/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    title: "Projets",
    href: "/operations/projects",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Workflow",
    href: "/operations/workflow",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
  },
];

// Navigation items for Gestion Module
const gestionNavigation: NavItem[] = [
  {
    title: "Employés",
    href: "/gestion/employees",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
];

// Navigation items for Admin Module
const adminNavigation: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/admin",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    title: "Utilisateurs",
    href: "/admin/users",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: "Rôles",
    href: "/admin/roles",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "Audit",
    href: "/admin/audit",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

// Navigation items for Billing Module
const billingNavigation: NavItem[] = [
  {
    title: "Factures",
    href: "/billing",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

// Navigation items for Contracts Module
const contractsNavigation: NavItem[] = [
  {
    title: "Contrats",
    href: "/contracts",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

// Navigation items for Agenda Module
const agendaNavigation: NavItem[] = [
  {
    title: "Calendrier",
    href: "/agenda",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isCommercialModuleOpen, setIsCommercialModuleOpen] = React.useState(true);
  const [isOperationsModuleOpen, setIsOperationsModuleOpen] = React.useState(
    pathname.startsWith("/operations")
  );
  const [isGestionModuleOpen, setIsGestionModuleOpen] = React.useState(
    pathname.startsWith("/gestion")
  );
  const [isAdminModuleOpen, setIsAdminModuleOpen] = React.useState(
    pathname.startsWith("/admin")
  );
  const [isBillingModuleOpen, setIsBillingModuleOpen] = React.useState(
    pathname.startsWith("/billing")
  );
  const [isContractsModuleOpen, setIsContractsModuleOpen] = React.useState(
    pathname.startsWith("/contracts")
  );
  const [isAgendaModuleOpen, setIsAgendaModuleOpen] = React.useState(
    pathname.startsWith("/agenda")
  );
  const [currentUser, setCurrentUser] = React.useState<{
    name?: string | null;
    email?: string | null;
  } | null>(null);

  React.useEffect(() => {
    async function loadUser() {
      try {
        const result = await getCurrentUserAction();
        if (result.success && result.data) {
          setCurrentUser(result.data);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
    loadUser();
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 glass border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ease-in-out shadow-xl backdrop-blur-xl",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <Link
              href="/commercial/dashboard"
              className="flex items-center space-x-3 group"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Hub Nukleo
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                aria-label="Close menu"
              >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Module Commercial - Sous-menu */}
            <div>
              <button
                onClick={() => setIsCommercialModuleOpen(!isCommercialModuleOpen)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>Module Commercial</span>
                </div>
                <svg
                  className={cn(
                    "w-4 h-4 text-gray-500 transition-transform",
                    isCommercialModuleOpen && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Sous-menu items Commercial */}
              {isCommercialModuleOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {commercialNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:translate-x-1"
                        )}
                      >
                        <span
                          className={cn(
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module Opérations - Sous-menu */}
            <div>
              <button
                onClick={() => setIsOperationsModuleOpen(!isOperationsModuleOpen)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Module Opérations</span>
                </div>
                <svg
                  className={cn(
                    "w-4 h-4 text-gray-500 transition-transform",
                    isOperationsModuleOpen && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Sous-menu items Opérations */}
              {isOperationsModuleOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {operationsNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:translate-x-1"
                        )}
                      >
                        <span
                          className={cn(
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module Gestion - Sous-menu */}
            <div>
              <button
                onClick={() => setIsGestionModuleOpen(!isGestionModuleOpen)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <span>Module Gestion</span>
                </div>
                <svg
                  className={cn(
                    "w-4 h-4 text-gray-500 transition-transform",
                    isGestionModuleOpen && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Sous-menu items Gestion */}
              {isGestionModuleOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {gestionNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:translate-x-1"
                        )}
                      >
                        <span
                          className={cn(
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module Admin - Sous-menu */}
            <div>
              <button
                onClick={() => setIsAdminModuleOpen(!isAdminModuleOpen)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Module Admin</span>
                </div>
                <svg
                  className={cn(
                    "w-4 h-4 text-gray-500 transition-transform",
                    isAdminModuleOpen && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Sous-menu items Admin */}
              {isAdminModuleOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {adminNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:translate-x-1"
                        )}
                      >
                        <span
                          className={cn(
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module Billing - Sous-menu */}
            <div>
              <button
                onClick={() => setIsBillingModuleOpen(!isBillingModuleOpen)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Module Billing</span>
                </div>
                <svg
                  className={cn(
                    "w-4 h-4 text-gray-500 transition-transform",
                    isBillingModuleOpen && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Sous-menu items Billing */}
              {isBillingModuleOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {billingNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:translate-x-1"
                        )}
                      >
                        <span
                          className={cn(
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module Contrats - Sous-menu */}
            <div>
              <button
                onClick={() => setIsContractsModuleOpen(!isContractsModuleOpen)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Module Contrats</span>
                </div>
                <svg
                  className={cn(
                    "w-4 h-4 text-gray-500 transition-transform",
                    isContractsModuleOpen && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Sous-menu items Contrats */}
              {isContractsModuleOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {contractsNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:translate-x-1"
                        )}
                      >
                        <span
                          className={cn(
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Module Calendrier */}
            <Link
              href="/agenda"
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                pathname.startsWith("/agenda")
                  ? "bg-primary text-white"
                  : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>📅 Calendrier</span>
            </Link
            >

            {/* Suppression du sous-menu collapsible */}
            {false && (
              <div>
                {agendaNavigation.map((item) => {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                          isActive
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white hover:translate-x-1"
                        )}
                      >
                        <span
                          className={cn(
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* User Info */}
            {currentUser && (
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {((currentUser.name || currentUser.email || "U")[0] || "U").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {currentUser.name || "Utilisateur"}
                  </div>
                  {currentUser.email && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {currentUser.email}
                    </div>
                  )}
                </div>
              </div>
            )}
            <Link
              href="/"
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Retour à l'accueil</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

