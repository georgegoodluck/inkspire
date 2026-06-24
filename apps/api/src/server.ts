import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import { env } from "./config/env";
import redis from "./config/redis";
import { initSearchIndexes } from "./config/search";
import { errorHandler } from "./middleware/errorHandler";
import { apiRateLimit } from "./middleware/rateLimit";
import { initSocketServer, setIO } from "./sockets";
import { startEmailWorker } from "./jobs/emailQueue";

import healthRouter from "./routes/health";

const app = express();
const httpServer = http.createServer(app);

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.WEB_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(apiRateLimit);

app.use("/api/health", healthRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use(errorHandler);

async function bootstrap() {
  await redis.connect();

  const io = initSocketServer(httpServer);
  setIO(io);

  initSearchIndexes();
  startEmailWorker();

  httpServer.listen(env.API_PORT, () => {
    console.log(`\n🚀 InkSpire API running`);
    console.log(`   Port:   ${env.API_PORT}`);
    console.log(`   Env:    ${env.NODE_ENV}`);
    console.log(`   Health: http://localhost:${env.API_PORT}/api/health\n`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Bootstrap failed:", err);
  process.exit(1);
});
