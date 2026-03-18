import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "https://ai-powered-customer-support-analytics-e7c1.onrender.com/api";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface KpiSummary {
  totalQueries: number;
  resolvedToday: number;
  automationRate: number;
  avgResponseTime: number;
  pendingEscalations: number;
  weeklyGrowth: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

export interface TrendPoint {
  period: string;
  orderStatus: number;
  deliveryDelay: number;
  refundRequest: number;
  productIssue: number;
  subscriptionIssue: number;
  paymentFailure: number;
  generalQuestion: number;
  other: number;
}

export interface PlatformBreakdown {
  platform: string;
  count: number;
}

export interface AutomationOpportunity {
  category: string;
  automationPotential: number;
  currentVolume: number;
  priority: "High" | "Medium" | "Low";
  suggestedSolution: string;
  estimatedTimeSaved: number;
}

export interface Query {
  id: number;
  message: string;
  category: string;
  platform: string;
  confidence: number;
  status: string;
  automatable: boolean;
  suggestedResponse: string | null;
  createdAt: string;
}

export function useGetKpis() {
  return useQuery<KpiSummary>({
    queryKey: ["kpis"],
    queryFn: () => apiFetch("/analytics/kpis"),
  });
}

export function useGetCategoryDistribution() {
  return useQuery<CategoryDistribution[]>({
    queryKey: ["distribution"],
    queryFn: () => apiFetch("/analytics/distribution"),
  });
}

export function useGetTrends(params: { period: "weekly" | "monthly" }) {
  return useQuery<TrendPoint[]>({
    queryKey: ["trends", params.period],
    queryFn: () => apiFetch(`/analytics/trends?period=${params.period}`),
  });
}

export function useGetPlatformBreakdown() {
  return useQuery<PlatformBreakdown[]>({
    queryKey: ["platforms"],
    queryFn: () => apiFetch("/analytics/platforms"),
  });
}

export function useGetAutomationOpportunities() {
  return useQuery<AutomationOpportunity[]>({
    queryKey: ["automation"],
    queryFn: () => apiFetch("/analytics/automation"),
  });
}

export function useGetQueries() {
  return useQuery<Query[]>({
    queryKey: ["queries"],
    queryFn: () => apiFetch("/queries"),
  });
}

export function useCreateQuery() {
  const queryClient = useQueryClient();

  return useMutation<Query, Error, { message: string; platform: string }>({
    mutationFn: async (body) => {
      const r = await fetch(`${API_BASE}/queries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        throw new Error(`Failed to analyze query: ${r.status}`);
      }

      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });
      queryClient.invalidateQueries({ queryKey: ["kpis"] });
      queryClient.invalidateQueries({ queryKey: ["distribution"] });
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      queryClient.invalidateQueries({ queryKey: ["automation"] });
      queryClient.invalidateQueries({ queryKey: ["trends"] });
    },
  });
}