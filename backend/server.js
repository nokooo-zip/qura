require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authController = require("./controller/authController");
const clientController = require("./controller/clientController");
const { requireAuth } = require("./middleware/auth");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "15mb" }));

// Prefer public DNS when Atlas resolution fails on some networks
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// ---------- Auth ----------
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);

// ---------- Clients (admin, protected) ----------
app.get("/api/clients", requireAuth, clientController.listClients);
app.get("/api/clients/:id", requireAuth, clientController.getClient);
app.post("/api/clients", requireAuth, clientController.createClient);
app.put("/api/clients/:id", requireAuth, clientController.updateClient);
app.delete("/api/clients/:id", requireAuth, clientController.deleteClient);
app.get("/api/clients/:id/qr", requireAuth, clientController.getClientQr);

// ---------- Public profile (QR destination, no auth) ----------
app.get("/api/public/:slug", clientController.getPublicBySlug);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`QURA API live on port ${PORT}`);
});
