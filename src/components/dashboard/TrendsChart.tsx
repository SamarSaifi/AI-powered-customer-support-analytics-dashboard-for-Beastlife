import { useState } from "react";
import { useGetTrends } from "@/hooks/useData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CSVLink } from "react-csv";
import { Download } from "lucide-react";
import { CustomTooltip, CustomLegend, CHART_COLORS, CHART_COLOR_LIST } from "@/lib/chart-utils";

export function TrendsChart() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const { data, isLoading, isFetching } = useGetTrends({ period });
  const loading = isLoading || isFetching;

  const isDark = document.documentElement.classList.contains("dark");
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  const exportData = data || [];

  const categories = [
    { key: "orderStatus", name: "Order Status", color: CHART_COLOR_LIST[0] },
    { key: "deliveryDelay", name: "Delivery Delay", color: CHART_COLOR_LIST[1] },
    { key: "refundRequest", name: "Refund Request", color: CHART_COLOR_LIST[2] },
    { key: "productIssue", name: "Product Issue", color: CHART_COLOR_LIST[3] },
    { key: "subscriptionIssue", name: "Subscription", color: CHART_COLOR_LIST[4] },
    { key: "paymentFailure", name: "Payment Failure", color: CHART_COLORS.blue },
    { key: "generalQuestion", name: "General", color: CHART_COLORS.purple },
    { key: "other", name: "Other", color: CHART_COLORS.green },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-4">
          <CardTitle className="text-base font-semibold">Volume Trends</CardTitle>
          <div className="flex bg-muted rounded-md p-0.5">
            <button
              onClick={() => setPeriod("weekly")}
              className={`px-2.5 py-1 text-xs rounded-sm font-medium transition-colors ${period === "weekly" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-2.5 py-1 text-xs rounded-sm font-medium transition-colors ${period === "monthly" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
          </div>
        </div>
        {!loading && exportData.length > 0 && (
          <CSVLink
            data={exportData}
            filename={`trends-${period}.csv`}
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
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: "rgba(0,0,0,0.05)", stroke: "none" }} />
              <Legend content={<CustomLegend />} />
              {categories.map((cat) => (
                <Area key={cat.key} type="monotone" dataKey={cat.key} name={cat.name} stackId="1" stroke={cat.color} fill={cat.color} fillOpacity={0.6} isAnimationActive={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
