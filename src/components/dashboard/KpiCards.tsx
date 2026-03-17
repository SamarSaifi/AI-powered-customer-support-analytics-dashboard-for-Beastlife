import { useGetKpis } from "@/hooks/useData";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export function KpiCards() {
  const { data, isLoading, isFetching } = useGetKpis();
  const loading = isLoading || isFetching;

  const kpis = [
    { title: "Total Queries", value: data?.totalQueries.toLocaleString(), trend: "up", change: `${data?.weeklyGrowth || 0}%`, color: "#0079F2" },
    { title: "Resolved Today", value: data?.resolvedToday.toLocaleString(), trend: "up", change: null, color: "#009118" },
    { title: "Automation Rate", value: `${data?.automationRate || 0}%`, trend: "up", change: null, color: "#0079F2" },
    { title: "Avg Response Time", value: `${data?.avgResponseTime || 0} hrs`, trend: "down", change: null, color: "#0079F2" },
    { title: "Pending Escalations", value: data?.pendingEscalations.toLocaleString(), trend: "down", change: null, color: "#A60808" },
    { title: "Weekly Growth", value: `${data?.weeklyGrowth || 0}%`, trend: "up", change: null, color: "#0079F2" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {kpis.map((kpi, i) => (
        <Card key={i}>
          <CardContent className="p-4 flex flex-col justify-center h-full">
            {loading ? (
              <>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: kpi.color }}>{kpi.value || "0"}</p>
                {kpi.change && (
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.trend === "up" ? <ArrowUpIcon className="w-3 h-3 text-green-600" /> : <ArrowDownIcon className="w-3 h-3 text-red-600" />}
                    <span className={`text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>{kpi.change}</span>
                    <span className="text-xs text-muted-foreground">vs last week</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
