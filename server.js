import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── Mock Data ────────────────────────────────────────────────────────────────

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
  { message: "Where is my order #12345?", category: "Order Status", confidence: 0.97, automatable: true, suggestedResponse: "Hi! Your order #12345 is currently in transit and expected to arrive within 2-3 business days. You can track it here: [tracking link]" },
  { message: "My package hasn't arrived yet and it's been 2 weeks", category: "Delivery Delay", confidence: 0.94, automatable: true, suggestedResponse: "We sincerely apologize for the delay! I've flagged your order for priority review and will update you within 24 hours with a resolution." },
  { message: "I want to cancel my subscription", category: "Subscription Issue", confidence: 0.96, automatable: true, suggestedResponse: "I understand you'd like to cancel. I've processed your cancellation request and you'll receive a confirmation email shortly. Is there anything we could do to keep you?" },
  { message: "The protein powder tastes terrible", category: "Product Issue", confidence: 0.89, automatable: false, suggestedResponse: null },
  { message: "Can I get a refund for my last order?", category: "Refund Request", confidence: 0.98, automatable: true, suggestedResponse: "Absolutely! I've initiated your refund which should appear in 3-5 business days. I'm also sending you a 15% discount for your next order." },
  { message: "My payment keeps failing", category: "Payment Failure", confidence: 0.95, automatable: true, suggestedResponse: "I'm sorry for the trouble! Please try clearing your browser cache or using a different payment method. If the issue persists, contact your bank." },
  { message: "What are the ingredients in your pre-workout?", category: "General Question", confidence: 0.91, automatable: true, suggestedResponse: "Our pre-workout contains Beta-Alanine, Caffeine (200mg), Creatine, Citrulline, and B-vitamins. Full label available on our website!" },
  { message: "Do you ship internationally?", category: "General Question", confidence: 0.93, automatable: true, suggestedResponse: "Yes! We ship to 45+ countries. International shipping typically takes 7-14 business days. Use code INTL10 for 10% off your first international order!" },
  { message: "My order shows delivered but I never received it", category: "Delivery Delay", confidence: 0.88, automatable: false, suggestedResponse: null },
  { message: "I received the wrong product", category: "Product Issue", confidence: 0.92, automatable: false, suggestedResponse: null },
  { message: "How do I pause my subscription?", category: "Subscription Issue", confidence: 0.94, automatable: true, suggestedResponse: "You can easily pause your subscription in your account dashboard under 'Manage Subscription'. You can pause for up to 3 months!" },
  { message: "When will my order ship?", category: "Order Status", confidence: 0.96, automatable: true, suggestedResponse: "Orders typically ship within 1-2 business days. You'll receive a tracking email as soon as your package ships!" },
  { message: "I was charged twice for my order", category: "Payment Failure", confidence: 0.97, automatable: false, suggestedResponse: null },
  { message: "The shaker bottle I got is defective", category: "Product Issue", confidence: 0.90, automatable: false, suggestedResponse: null },
  { message: "Can I change my subscription flavor?", category: "Subscription Issue", confidence: 0.88, automatable: true, suggestedResponse: "Of course! Log into your account and go to 'Subscription Settings' to change your flavor preference. Changes apply to your next shipment!" },
  { message: "I haven't received my tracking number", category: "Order Status", confidence: 0.95, automatable: true, suggestedResponse: "Your tracking info is sent to your email once shipped. Please check your spam folder! You can also find it in your account under 'My Orders'." },
  { message: "My card was declined but the charge is pending", category: "Payment Failure", confidence: 0.93, automatable: true, suggestedResponse: "Pending charges from failed transactions are automatically released within 3-5 business days. No action is needed from your end!" },
  { message: "What's the best protein for weight loss?", category: "General Question", confidence: 0.85, automatable: true, suggestedResponse: "For weight loss, we recommend our Lean Whey Isolate — high protein, low carbs, and only 120 calories per serving. Use code LEAN20 for 20% off!" },
  { message: "I'd like a refund and to cancel my account", category: "Refund Request", confidence: 0.91, automatable: false, suggestedResponse: null },
  { message: "Package damaged during shipping", category: "Delivery Delay", confidence: 0.87, automatable: false, suggestedResponse: null },
  { message: "How much protein should I take daily?", category: "General Question", confidence: 0.89, automatable: true, suggestedResponse: "Generally, 0.7-1g of protein per pound of body weight is recommended for active individuals. Our subscription plan delivers the perfect monthly supply!" },
  { message: "My promo code isn't working", category: "Other", confidence: 0.84, automatable: true, suggestedResponse: "Sorry about that! Please make sure the code is entered exactly as shown and hasn't expired. If still not working, I'll manually apply the discount for you!" },
  { message: "Can I stack your products?", category: "General Question", confidence: 0.86, automatable: true, suggestedResponse: "Yes, our products are designed to be stacked! Our most popular combo is Pre-Workout + Whey Protein + Creatine. Check out our Stack & Save bundles!" },
  { message: "Subscription charge hit on wrong date", category: "Subscription Issue", confidence: 0.90, automatable: true, suggestedResponse: "You can change your billing date anytime in your account settings. I've also noted your preference and can adjust it manually — just let me know your preferred date!" },
  { message: "Product not as advertised", category: "Product Issue", confidence: 0.83, automatable: false, suggestedResponse: null },
  { message: "Where can I find your store?", category: "General Question", confidence: 0.92, automatable: true, suggestedResponse: "We're currently online only at beastlife.com! We offer free shipping on orders over $50 and same-day dispatch before 2pm EST." },
  { message: "Refund not received after 7 days", category: "Refund Request", confidence: 0.96, automatable: false, suggestedResponse: null },
  { message: "Does your whey contain gluten?", category: "General Question", confidence: 0.94, automatable: true, suggestedResponse: "Our Whey Protein is certified gluten-free and produced in a dedicated gluten-free facility. Safe for those with celiac disease!" },
  { message: "App not syncing with my subscription", category: "Other", confidence: 0.79, automatable: false, suggestedResponse: null },
  { message: "Order arrived but missing items", category: "Order Status", confidence: 0.88, automatable: false, suggestedResponse: null },
];

let queriesDb = SAMPLE_MESSAGES.map((q, i) => ({
  id: i + 1,
  message: q.message,
  category: q.category,
  platform: PLATFORMS[i % PLATFORMS.length],
  confidence: Math.round(q.confidence * 100),
  status: STATUSES[i % STATUSES.length],
  automatable: q.automatable,
  suggestedResponse: q.suggestedResponse,
  createdAt: new Date(Date.now() - (30 - i) * 60 * 60 * 1000).toISOString(),
}));

let nextId = queriesDb.length + 1;

// ─── Classifier ──────────────────────────────────────────────────────────────

function classify(message) {
  const m = message.toLowerCase();
  if (/order|track|shipped|shipping|dispatch|status/.test(m)) return { category: "Order Status", confidence: 0.97, automatable: true, suggestedResponse: "Your order is being processed. You'll receive a tracking email within 24 hours!" };
  if (/delay|late|haven.t arrived|not received|missing|lost/.test(m)) return { category: "Delivery Delay", confidence: 0.93, automatable: false, suggestedResponse: null };
  if (/refund|money back|return|reimburse/.test(m)) return { category: "Refund Request", confidence: 0.95, automatable: true, suggestedResponse: "Your refund has been initiated and will appear within 3-5 business days." };
  if (/product|taste|quality|defect|broken|damaged|wrong/.test(m)) return { category: "Product Issue", confidence: 0.88, automatable: false, suggestedResponse: null };
  if (/subscription|cancel|pause|plan|recurring/.test(m)) return { category: "Subscription Issue", confidence: 0.92, automatable: true, suggestedResponse: "You can manage your subscription anytime in your account dashboard!" };
  if (/payment|charge|billing|card|declined|invoice/.test(m)) return { category: "Payment Failure", confidence: 0.94, automatable: true, suggestedResponse: "Please try a different payment method or contact your bank. Pending charges are released in 3-5 days." };
  if (/what|how|when|where|why|ingredients|protein|supplement|gluten|ship/.test(m)) return { category: "General Question", confidence: 0.86, automatable: true, suggestedResponse: "Great question! Please check our FAQ at beastlife.com/faq for detailed answers." };
  return { category: "Other", confidence: 0.75, automatable: false, suggestedResponse: null };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get("/api/analytics/kpis", (_req, res) => {
  res.json({
    totalQueries: queriesDb.length,
    resolvedToday: queriesDb.filter(q => q.status === "Resolved").length,
    automationRate: Math.round((queriesDb.filter(q => q.automatable).length / queriesDb.length) * 100),
    avgResponseTime: 1.4,
    pendingEscalations: queriesDb.filter(q => q.status === "Escalated").length,
    weeklyGrowth: 12,
  });
});

app.get("/api/analytics/distribution", (_req, res) => {
  const counts = {};
  for (const c of CATEGORIES) counts[c] = 0;
  for (const q of queriesDb) counts[q.category] = (counts[q.category] || 0) + 1;
  const total = queriesDb.length;
  const result = Object.entries(counts).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / total) * 100),
  }));
  res.json(result);
});

app.get("/api/analytics/trends", (req, res) => {
  const period = req.query.period === "monthly" ? "monthly" : "weekly";
  const labels = period === "weekly"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const data = labels.map((label) => ({
    period: label,
    orderStatus: Math.floor(Math.random() * 20) + 5,
    deliveryDelay: Math.floor(Math.random() * 15) + 3,
    refundRequest: Math.floor(Math.random() * 10) + 2,
    productIssue: Math.floor(Math.random() * 8) + 1,
    subscriptionIssue: Math.floor(Math.random() * 12) + 2,
    paymentFailure: Math.floor(Math.random() * 6) + 1,
    generalQuestion: Math.floor(Math.random() * 18) + 4,
    other: Math.floor(Math.random() * 5) + 1,
  }));
  res.json(data);
});

app.get("/api/analytics/platforms", (_req, res) => {
  const counts = {};
  for (const p of PLATFORMS) counts[p] = 0;
  for (const q of queriesDb) counts[q.platform] = (counts[q.platform] || 0) + 1;
  res.json(Object.entries(counts).map(([platform, count]) => ({ platform, count })));
});

app.get("/api/analytics/automation", (_req, res) => {
  res.json([
    { category: "Order Status", automationPotential: 92, currentVolume: 847, priority: "High", suggestedSolution: "Deploy order tracking chatbot with API integration", estimatedTimeSaved: 124 },
    { category: "General Questions", automationPotential: 88, currentVolume: 623, priority: "High", suggestedSolution: "FAQ knowledge base with semantic search", estimatedTimeSaved: 98 },
    { category: "Subscription Issues", automationPotential: 79, currentVolume: 412, priority: "Medium", suggestedSolution: "Self-service subscription management portal", estimatedTimeSaved: 76 },
    { category: "Payment Failures", automationPotential: 71, currentVolume: 298, priority: "Medium", suggestedSolution: "Automated payment retry with smart routing", estimatedTimeSaved: 52 },
    { category: "Delivery Delays", automationPotential: 45, currentVolume: 534, priority: "Low", suggestedSolution: "Proactive delay notifications via SMS/email", estimatedTimeSaved: 38 },
  ]);
});

app.get("/api/queries", (_req, res) => {
  res.json([...queriesDb].reverse());
});

app.post("/api/queries", (req, res) => {
  const { message, platform } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });

  const result = classify(message);
  const newQuery = {
    id: nextId++,
    message,
    platform: platform || "Website Chat",
    category: result.category,
    confidence: Math.round(result.confidence * 100),
    status: "Pending",
    automatable: result.automatable,
    suggestedResponse: result.suggestedResponse,
    createdAt: new Date().toISOString(),
  };
  queriesDb.push(newQuery);
  res.status(201).json(newQuery);
});

app.listen(PORT, () => {
  console.log(`Beastlife API server running at http://localhost:${PORT}`);
});
