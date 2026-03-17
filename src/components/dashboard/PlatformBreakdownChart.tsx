import { useGetPlatformBreakdown } from "@/hooks/useData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CSVLink } from "react-csv";
import { Download } from "lucide-react";
import { CustomTooltip, CHART_COLORS } from "@/lib/chart-utils";

export function PlatformBreakdownChart() {
  const { data, isLoading, isFetching } = useGetPlatformBreakdown();
  const loading = isLoading || isFetching;

  const isDark = document.documentElement.classList.contains("dark");
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  const exportData = data || [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Platform Breakdown</CardTitle>
        {!loading && exportData.length > 0 && (
          <CSVLink
            data={exportData}
            filename="platform-breakdown.csv"
            className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80"
            style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563" }}
            aria-label="Export chart data as CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </CSVLink>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {loading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : (
          <ResponsiveContainer width="100%" height={300} debounce={0}>
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickLine={false} axisLine={false} />
              <YAxis dataKey="platform" type="category" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickLine={false} axisLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
              <Bar dataKey="count" name="Queries" fill={CHART_COLORS.blue} fillOpacity={0.8} isAnimationActive={false} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
