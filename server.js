const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Beastlife API is running...");
});

const CATEGORIES = [
  "Order Status",
  "Delivery Delay",
  "Refund Request",
  "Product Issue",
  "Subscription Issue",
  "Payment Failure",
  "General Question",
  "Other",
];

const PLATFORMS = [
  "Website Chat",
  "Instagram DMs",
  "WhatsApp",
  "Email",
  "Facebook",
  "TikTok DMs",
];

const STATUSES = ["Resolved", "Pending", "Escalated"];

const SAMPLE_MESSAGES = [
  {
    message: "Where is my order #12345?",
    category: "Order Status",
    confidence: 97,
    automatable: true,
    suggestedResponse:
      "Your order is in transit and should arrive in 2-3 business days.",
  },
  {
    message: "My package hasn't arrived yet and it's been 2 weeks",
    category: "Delivery Delay",
    confidence: 94,
    automatable: false,
    suggestedResponse: null,
  },
  {
    message: "I want to cancel my subscription",
    category: "Subscription Issue",
    confidence: 96,
    automatable: true,
    suggestedResponse:
      "You can manage or cancel your subscription from your account dashboard.",
  },
  {
    message: "The protein powder tastes terrible",
    category: "Product Issue",
    confidence: 89,
    automatable: false,
    suggestedResponse: null,
  },
  {
    message: "Can I get a refund for my last order?",
    category: "Refund Request",
    confidence: 98,
    automatable: true,
    suggestedResponse:
      "Your refund has been initiated and will reflect in 3-5 business days.",
  },
  {
    message: "My payment keeps failing",
    category: "Payment Failure",
    confidence: 95,
    automatable: true,
    suggestedResponse:
      "Please try a different payment method or contact your bank.",
  },
  {
    message: "What are the ingredients in your pre-workout?",
    category: "General Question",
    confidence: 91,
    automatable: true,
    suggestedResponse:
      "You can check the full ingredient list on the product page.",
  },
  {
    message: "Do you ship internationally?",
    category: "General Question",
    confidence: 93,
    automatable: true,
    suggestedResponse: "Yes, we ship internationally to many countries.",
  },
];

let queriesDb = SAMPLE_MESSAGES.map((q, i) => ({
  id: i + 1,
  message: q.message,
  category: q.category,
  platform: PLATFORMS[i % PLATFORMS.length],
  confidence: q.confidence,
  status: STATUSES[i % STATUSES.length],
  automatable: q.automatable,
  suggestedResponse: q.suggestedResponse,
  createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
}));

let nextId = queriesDb.length + 1;

function classify(message) {
  const msg = message.toLowerCase();

  if (/refund|money back|return/.test(msg)) {
    return {
      category: "Refund Request",
      confidence: 95,
      automatable: true,
      suggestedResponse:
        "Your refund has been initiated and will reflect in 3-5 business days.",
    };
  }

  if (/delay|late|not arrived|missing|lost/.test(msg)) {
    return {
      category: "Delivery Delay",
      confidence: 90,
      automatable: false,
      suggestedResponse: null,
    };
  }

  if (/payment|card|charged|billing|declined/.test(msg)) {
    return {
      category: "Payment Failure",
      confidence: 92,
      automatable: true,
      suggestedResponse:
        "Please try another payment method or contact your bank.",
    };
  }

  if (/order|track|shipping|status/.test(msg)) {
    return {
      category: "Order Status",
      confidence: 94,
      automatable: true,
      suggestedResponse:
        "You can track your order from the orders page in your account.",
    };
  }

  if (/subscription|cancel|pause|plan/.test(msg)) {
    return {
      category: "Subscription Issue",
      confidence: 91,
      automatable: true,
      suggestedResponse:
        "You can manage your subscription in your account dashboard.",
    };
  }

  if (/broken|damaged|wrong product|defect|quality|taste/.test(msg)) {
    return {
      category: "Product Issue",
      confidence: 88,
      automatable: false,
      suggestedResponse: null,
    };
  }

  return {
    category: "General Question",
    confidence: 80,
    automatable: true,
    suggestedResponse:
      "Thanks for reaching out. We are looking into your query.",
  };
}

// KPIs
app.get("/api/analytics/kpis", (_req, res) => {
  const totalQueries = queriesDb.length;
  const resolvedToday = queriesDb.filter((q) => q.status === "Resolved").length;
  const automatableCount = queriesDb.filter((q) => q.automatable).length;
  const pendingEscalations = queriesDb.filter(
    (q) => q.status === "Escalated"
  ).length;

  res.json({
    totalQueries,
    resolvedToday,
    automationRate: totalQueries
      ? Math.round((automatableCount / totalQueries) * 100)
      : 0,
    avgResponseTime: 1.4,
    pendingEscalations,
    weeklyGrowth: 12,
  });
});

// Distribution
app.get("/api/analytics/distribution", (_req, res) => {
  const counts = {};
  CATEGORIES.forEach((c) => {
    counts[c] = 0;
  });

  queriesDb.forEach((q) => {
    counts[q.category] = (counts[q.category] || 0) + 1;
  });

  const total = queriesDb.length || 1;

  const result = Object.entries(counts).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / total) * 100),
  }));

  res.json(result);
});

// Trends
app.get("/api/analytics/trends", (req, res) => {
  const period = req.query.period === "monthly" ? "monthly" : "weekly";

  const labels =
    period === "monthly"
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const data = labels.map((label) => ({
    period: label,
    orderStatus: Math.floor(Math.random() * 10) + 3,
    deliveryDelay: Math.floor(Math.random() * 8) + 2,
    refundRequest: Math.floor(Math.random() * 6) + 1,
    productIssue: Math.floor(Math.random() * 5) + 1,
    subscriptionIssue: Math.floor(Math.random() * 6) + 1,
    paymentFailure: Math.floor(Math.random() * 4) + 1,
    generalQuestion: Math.floor(Math.random() * 7) + 2,
    other: Math.floor(Math.random() * 3) + 1,
  }));

  res.json(data);
});

// Platforms
app.get("/api/analytics/platforms", (_req, res) => {
  const counts = {};
  PLATFORMS.forEach((p) => {
    counts[p] = 0;
  });

  queriesDb.forEach((q) => {
    counts[q.platform] = (counts[q.platform] || 0) + 1;
  });

  res.json(
    Object.entries(counts).map(([platform, count]) => ({
      platform,
      count,
    }))
  );
});

// Automation
app.get("/api/analytics/automation", (_req, res) => {
  res.json([
    {
      category: "Order Status",
      automationPotential: 92,
      currentVolume: 120,
      priority: "High",
      suggestedSolution: "Order tracking chatbot",
      estimatedTimeSaved: 40,
    },
    {
      category: "Refund Request",
      automationPotential: 84,
      currentVolume: 60,
      priority: "High",
      suggestedSolution: "Refund workflow automation",
      estimatedTimeSaved: 25,
    },
    {
      category: "Subscription Issue",
      automationPotential: 78,
      currentVolume: 45,
      priority: "Medium",
      suggestedSolution: "Self-service subscription portal",
      estimatedTimeSaved: 18,
    },
    {
      category: "Payment Failure",
      automationPotential: 70,
      currentVolume: 35,
      priority: "Medium",
      suggestedSolution: "Payment retry assistant",
      estimatedTimeSaved: 14,
    },
  ]);
});

// Get all queries
app.get("/api/queries", (_req, res) => {
  res.json([...queriesDb].reverse());
});

// Analyze / add query
app.post("/api/queries", (req, res) => {
  const { message, platform } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const result = classify(message);

  const newQuery = {
    id: nextId++,
    message,
    category: result.category,
    platform: platform || "Website Chat",
    confidence: result.confidence,
    status: "Pending",
    automatable: result.automatable,
    suggestedResponse: result.suggestedResponse,
    createdAt: new Date().toISOString(),
  };

  queriesDb.push(newQuery);
  res.status(201).json(newQuery);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});