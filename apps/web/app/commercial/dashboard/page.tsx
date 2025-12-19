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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de bord Commercial
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
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
          }))}
          contacts={recentContacts.map((contact) => ({
            ...contact,
            email: contact.email || "",
          }))}
          companies={recentCompanies}
        />
      </div>
    </>
  );
}
