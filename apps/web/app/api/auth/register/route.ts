import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@inkspire/database'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, username, email, password } = await req.json()

    if (!name || !username || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: existingUser.email === email ? 'Email already in use' : 'Username already taken' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, username, email, passwordHash, role: 'READER' },
      select: { id: true, email: true, name: true, username: true, role: true },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('[REGISTER]', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
