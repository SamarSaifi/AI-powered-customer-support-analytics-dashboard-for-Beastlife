import { useGetCategoryDistribution } from "@/hooks/useData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CSVLink } from "react-csv";
import { Download } from "lucide-react";
import { CustomTooltip, CustomLegend, CHART_COLOR_LIST } from "@/lib/chart-utils";

export function CategoryDistributionChart() {
  const { data, isLoading, isFetching } = useGetCategoryDistribution();
  const loading = isLoading || isFetching;

  const isDark = document.documentElement.classList.contains("dark");
  const exportData = data || [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Query Distribution</CardTitle>
        {!loading && exportData.length > 0 && (
          <CSVLink
            data={exportData}
            filename="category-distribution.csv"
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
            <PieChart>
              <Pie
                data={data}
                dataKey="percentage"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                cornerRadius={2}
                paddingAngle={2}
                isAnimationActive={false}
                stroke="none"
              >
                {data?.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLOR_LIST[index % CHART_COLOR_LIST.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
