import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import fs from "fs";
import path from "path";
import job from "./lib/cron.js";

const app = express();

const publicDir = path.join(process.cwd(), "public");

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

//It's important that you don't parse the webhook event data, it should be in the raw format.
app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook,
);

app.get("/health", (req, res) => {whsec_a9NhaG660l0uRvB3HFtUa+zbtHO3DRfs
  res.status(200).json({ ok: true });
});

//if the public directory exists, serve the static files
//this is for the production build
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port 3000.");

  if (process.env.NODE_ENV === "production") job.start();
});
