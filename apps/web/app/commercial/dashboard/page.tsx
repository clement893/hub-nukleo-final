import {
  getOpportunitiesStats,
  getRecentOpportunities,
  getContactsStats,
  getCompaniesStats,
  getRecentContacts,
  getRecentCompanies,
} from "@nukleo/commercial";
import { DashboardKPIs } from "./components/DashboardKPIs";
import { PipelineChart } from "./components/PipelineChart";
import { RecentActivity } from "./components/RecentActivity";
import { logger } from "@/lib/logger";

// Force dynamic rendering to avoid SSR issues with Prisma during build
export const dynamic = "force-dynamic";
// Cache for 60 seconds to improve performance
export const revalidate = 60;

export default async function CommercialDashboard() {
  let opportunitiesStats: Awaited<ReturnType<typeof getOpportunitiesStats>>;
  let contactsCount: number;
  let companiesCount: number;
  let recentOpportunities: Awaited<ReturnType<typeof getRecentOpportunities>>;
  let recentContacts: Awaited<ReturnType<typeof getRecentContacts>>;
  let recentCompanies: Awaited<ReturnType<typeof getRecentCompanies>>;

  try {
    [
      opportunitiesStats,
      contactsCount,
      companiesCount,
      recentOpportunities,
      recentContacts,
      recentCompanies,
    ] = await Promise.all([
      getOpportunitiesStats(),
      getContactsStats(),
      getCompaniesStats(),
      getRecentOpportunities(5),
      getRecentContacts(5),
      getRecentCompanies(5),
    ]);
  } catch (error) {
    logger.error("Error loading dashboard data", error instanceof Error ? error : new Error(String(error)));
    // Return default values if database is not accessible
    opportunitiesStats = {
      totalOpportunities: 0,
      wonOpportunities: 0,
      conversionRate: 0,
      totalRevenue: 0,
      pipelineByStage: [],
    };
    contactsCount = 0;
    companiesCount = 0;
    recentOpportunities = [];
    recentContacts = [];
    recentCompanies = [];
  }

  return (
    <>
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-3">
          Tableau de bord Commercial
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Vue d'ensemble de votre activité commerciale
        </p>
      </div>

      <DashboardKPIs
        totalOpportunities={opportunitiesStats.totalOpportunities}
        conversionRate={opportunitiesStats.conversionRate}
        totalRevenue={
          typeof opportunitiesStats.totalRevenue === "number"
            ? opportunitiesStats.totalRevenue
            : Number(opportunitiesStats.totalRevenue)
        }
        contactsCount={contactsCount}
        companiesCount={companiesCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <PipelineChart
          pipelineByStage={opportunitiesStats.pipelineByStage.map((item) => ({
            ...item,
            value:
              typeof item.value === "number"
                ? item.value
                : Number(item.value),
            stage: String(item.stage),
          }))}
        />
        <RecentActivity
          opportunities={recentOpportunities.map((opp) => ({
            ...opp,
            value: opp.value
              ? typeof opp.value === "number"
                ? opp.value
                : Number(opp.value)
              : 0,
            stage: String(opp.stage),
            createdAt: opp.createdAt instanceof Date ? opp.createdAt : new Date(opp.createdAt),
          }))}
          contacts={recentContacts.map((contact) => ({
            ...contact,
            email: contact.email || "",
            createdAt: contact.createdAt instanceof Date ? contact.createdAt : new Date(contact.createdAt),
          }))}
          companies={recentCompanies.map((company) => ({
            ...company,
            createdAt: company.createdAt instanceof Date ? company.createdAt : new Date(company.createdAt),
          }))}
        />
      </div>
    </>
  );
}
