import { useState } from "react";
import { useCreateQuery } from "@/hooks/useData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, CheckCircle, AlertCircle } from "lucide-react";

export function QueryAnalyzer() {
  const [message, setMessage] = useState("");
  const [platform, setPlatform] = useState("Website Chat");
  const [analyzedResult, setAnalyzedResult] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const createQueryMutation = useCreateQuery();

  const handleAnalyze = () => {
    if (!message.trim()) return;

    setFeedback(null);

    createQueryMutation.mutate(
      { message, platform },
      {
        onSuccess: (data) => {
          setAnalyzedResult(data);
          setFeedback({ type: "success", msg: "Query successfully analyzed." });
        },
        onError: (error) => {
          console.error("Analyze error:", error);
          setFeedback({ type: "error", msg: "Failed to analyze query. Please try again." });
        },
      }
    );
  };

  return (
    <Card className="h-full border-primary/20 shadow-sm bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="px-4 pt-4 pb-2 border-b border-border/50 bg-card/50">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI Query Analyzer
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-muted-foreground">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website Chat">Website Chat</SelectItem>
                <SelectItem value="Instagram DMs">Instagram DMs</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-muted-foreground">Customer Message</Label>
            <Textarea
              placeholder="Paste a customer message here to test the AI classifier..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none h-24"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!message.trim() || createQueryMutation.isPending}
            className="w-full h-9 font-semibold"
          >
            {createQueryMutation.isPending ? "Analyzing..." : "Analyze Query"}
            <Zap className="w-4 h-4 ml-2" />
          </Button>

          {feedback && (
            <div
              className={`flex items-center gap-2 text-xs p-2 rounded-md ${
                feedback.type === "success"
                  ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              )}
              {feedback.msg}
            </div>
          )}
        </div>

        {analyzedResult && (
          <div className="mt-4 p-4 bg-background border rounded-lg shadow-sm space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
              Analysis Results
            </h4>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div>
                <span className="text-muted-foreground text-xs block">Category</span>
                <Badge variant="outline" className="mt-1 font-medium">
                  {analyzedResult.category}
                </Badge>
              </div>

              <div>
                <span className="text-muted-foreground text-xs block">Confidence</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={analyzedResult.confidence > 90 ? "h-full bg-green-500" : "h-full bg-amber-500"}
                      style={{ width: `${analyzedResult.confidence}%` }}
                    />
                  </div>
                  <span className="font-semibold text-xs">{analyzedResult.confidence}%</span>
                </div>
              </div>

              <div className="col-span-2">
                <span className="text-muted-foreground text-xs block mb-1">Automatable</span>
                {analyzedResult.automatable ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="secondary">No</Badge>
                )}
              </div>

              {analyzedResult.suggestedResponse && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-xs block mb-1">Suggested Auto-Reply</span>
                  <div className="bg-muted p-2.5 rounded-md text-xs italic text-foreground border-l-2 border-primary">
                    "{analyzedResult.suggestedResponse}"
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}