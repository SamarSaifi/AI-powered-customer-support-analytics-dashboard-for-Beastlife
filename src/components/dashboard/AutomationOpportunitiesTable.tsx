import { useGetAutomationOpportunities } from "@/hooks/useData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function AutomationOpportunitiesTable() {
  const { data, isLoading, isFetching } = useGetAutomationOpportunities();
  const loading = isLoading || isFetching;

  return (
    <Card>
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="text-base font-semibold">Automation Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Automation Potential</TableHead>
                  <TableHead className="text-right">Current Volume</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Suggested Solution</TableHead>
                  <TableHead className="text-right">Est. Time Saved (hrs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((opp, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium whitespace-nowrap">{opp.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${opp.automationPotential}%` }} />
                        </div>
                        <span className="text-sm">{opp.automationPotential}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{opp.currentVolume.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={opp.priority === "High" ? "destructive" : opp.priority === "Medium" ? "default" : "secondary"} className="rounded-md">
                        {opp.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm min-w-[200px]">{opp.suggestedSolution}</TableCell>
                    <TableCell className="text-right font-medium text-green-600 dark:text-green-400">+{opp.estimatedTimeSaved}</TableCell>
                  </TableRow>
                ))}
                {!data?.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      No automation opportunities found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
