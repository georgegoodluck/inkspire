import { Request, Response, NextFunction } from 'express'
import { getToken } from 'next-auth/jwt'
import { Role } from '@inkspire/database'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: Role
  }
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET!,
    })

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.user = {
      id: token.id as string,
      email: token.email as string,
      role: token.role as Role,
    }

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    next()
  }
}
