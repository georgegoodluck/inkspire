import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@inkspire/database', 'bcryptjs'],
}

export default nextConfig
