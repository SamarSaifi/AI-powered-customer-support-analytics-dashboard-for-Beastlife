const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ KPI API (already working)
app.get("/api/analytics/kpis", (req, res) => {
  res.json({
    totalQueries: 30,
    resolvedToday: 10,
    automationRate: 63,
    avgResponseTime: 1.4,
    pendingEscalations: 10,
    weeklyGrowth: 12
  });
});

// ✅ MAIN FIX (IMPORTANT)
app.post("/api/queries", (req, res) => {
  const { message, platform } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  let category = "General";
  let confidence = 80;

  const msg = message.toLowerCase();

  if (msg.includes("refund")) {
    category = "Refund Request";
    confidence = 95;
  } else if (msg.includes("delay")) {
    category = "Delivery Delay";
  } else if (msg.includes("payment")) {
    category = "Payment Failure";
  } else if (msg.includes("order")) {
    category = "Order Status";
  }

  res.json({
    message,
    category,
    confidence,
    status: "Resolved",
    automatable: true,
    platform,
    suggestedResponse: "We are looking into your issue. Thank you for your patience."
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});