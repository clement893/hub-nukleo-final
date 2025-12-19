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

export default async function CommercialDashboard() {
  const [
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord Commercial
        </h1>
        <p className="text-gray-600 mt-2">
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
        <PipelineChart pipelineByStage={opportunitiesStats.pipelineByStage} />
        <RecentActivity
          opportunities={recentOpportunities}
          contacts={recentContacts}
          companies={recentCompanies}
        />
      </div>
    </div>
  );
}
