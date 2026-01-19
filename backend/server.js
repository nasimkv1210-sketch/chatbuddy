const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config(); // Render handles envs automatically

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS CONFIG - MUST BE FIRST (immediately after app creation)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://chatbuddy-one.vercel.app',
    'https://chatbuddy-fbgxaqvx7-nasims-projects-9045bf5d.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 🔥 THIS IS REQUIRED FOR PREFLIGHT
app.options('*', cors());

/* =========================
   SECURITY MIDDLEWARE
========================= */
app.use(
  helmet({
    contentSecurityPolicy: false, // safer for APIs + frontend apps
  })
);

/* =========================
   RATE LIMITING
========================= */
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/* =========================
   BODY PARSING
========================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   DATABASE (OPTIONAL)
========================= */
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ No MongoDB URI provided. Running without DB.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

connectDB();

/* =========================
   ROUTES
========================= */
console.log("🔄 Loading routes...");
app.use("/api/auth", require("./routes/auth").router);
app.use("/api/users", require("./routes/users"));
app.use("/api/ai", require("./routes/ai")());
console.log("✅ Routes loaded");

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   ERROR HANDLING
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
