import { useState, useMemo } from "react";
import { useGetQueries } from "@/hooks/useData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export function LiveQueriesTable() {
  const { data, isLoading, isFetching } = useGetQueries();
  const loading = isLoading || isFetching;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter(q =>
      q.message.toLowerCase().includes(lower) ||
      q.category.toLowerCase().includes(lower) ||
      q.platform.toLowerCase().includes(lower)
    );
  }, [data, searchTerm]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Live Queries Feed</CardTitle>
        <Input
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-[200px] h-8 text-xs"
        />
      </CardHeader>
      <CardContent className="flex-1 overflow-auto max-h-[500px]">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[300px]">Message</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead className="text-center">Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="text-sm max-w-[300px] truncate" title={q.message}>
                    {q.message}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal bg-muted">
                      {q.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{q.platform}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-xs font-semibold ${q.confidence > 90 ? "text-green-600" : q.confidence > 70 ? "text-amber-600" : "text-red-600"}`}>
                      {q.confidence}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`font-normal ${
                      q.status === "Resolved" ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200" :
                      q.status === "Pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-200" :
                      "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {q.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(q.createdAt), "MMM d, h:mm a")}
                  </TableCell>
                </TableRow>
              ))}
              {!filteredData.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                    No queries match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
