import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(220).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional().nullable(),
  tagIds: z.array(z.string()).max(10).optional(),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain a number"),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  bio: z.string().max(300).optional().nullable(),
  website: z.string().url().optional().nullable(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  postId: z.string(),
  parentId: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
