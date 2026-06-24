import { Router } from "express";
import { prisma } from "@inkspire/database";
import redis from "../config/redis";
import { meiliClient } from "../config/search";

const router = Router();

router.get("/", async (_req, res) => {
  const checks = await Promise.allSettled([
    prisma.$queryRaw`SELECT 1`,
    redis.ping(),
    meiliClient.health(),
  ]);

  const [db, redisCheck, search] = checks;

  const status = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      database: db.status === "fulfilled" ? "healthy" : "unhealthy",
      redis: redisCheck.status === "fulfilled" ? "healthy" : "unhealthy",
      search: search.status === "fulfilled" ? "healthy" : "unhealthy",
    },
  };

  const allHealthy = Object.values(status.services).every(
    (s) => s === "healthy"
  );
  res.status(allHealthy ? 200 : 503).json(status);
});

export default router;
