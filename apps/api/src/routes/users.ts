import { Router } from "express";
import { prisma } from "@inkspire/database";
import { requireAuth, requireRole } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";

const router = Router();

// Get current user profile
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get public author profile by username
router.get("/:username", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        posts: {
          where: { status: "PUBLISHED" },
          orderBy: { publishedAt: "desc" },
          take: 10,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            publishedAt: true,
            readingTime: true,
            viewCount: true,
          },
        },
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "Author not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update current user profile
router.patch("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, bio, avatarUrl },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        role: true,
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: list all users
router.get("/", requireAuth, requireRole("ADMIN"), async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update user role
router.patch(
  "/:id/role",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const { role } = req.body;

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { role },
        select: { id: true, name: true, email: true, role: true },
      });

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
