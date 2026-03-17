import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { CategoryDistributionChart } from "@/components/dashboard/CategoryDistributionChart";
import { TrendsChart } from "@/components/dashboard/TrendsChart";
import { PlatformBreakdownChart } from "@/components/dashboard/PlatformBreakdownChart";
import { AutomationOpportunitiesTable } from "@/components/dashboard/AutomationOpportunitiesTable";
import { LiveQueriesTable } from "@/components/dashboard/LiveQueriesTable";
import { QueryAnalyzer } from "@/components/dashboard/QueryAnalyzer";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background px-5 py-4 pt-[32px] pb-[32px] pl-[24px] pr-[24px]">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <DashboardHeader />
        <KpiCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <CategoryDistributionChart />
          </div>
          <div className="lg:col-span-2">
            <TrendsChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <PlatformBreakdownChart />
          </div>
          <div className="lg:col-span-3">
            <AutomationOpportunitiesTable />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <LiveQueriesTable />
          </div>
          <div className="lg:col-span-1">
            <QueryAnalyzer />
          </div>
        </div>
      </div>
    </div>
  );
}
