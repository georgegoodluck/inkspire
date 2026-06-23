import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@inkspire.com" },
    update: {},
    create: {
      email: "admin@inkspire.com",
      name: "InkSpire Admin",
      username: "admin",
      role: Role.ADMIN,
      bio: "Platform administrator",
    },
  });

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "technology" },
      update: {},
      create: { name: "Technology", slug: "technology" },
    }),
    prisma.tag.upsert({
      where: { slug: "design" },
      update: {},
      create: { name: "Design", slug: "design" },
    }),
    prisma.tag.upsert({
      where: { slug: "writing" },
      update: {},
      create: { name: "Writing", slug: "writing" },
    }),
  ]);

  console.log(`✅ Admin created: ${admin.email}`);
  console.log(`✅ Tags created: ${tags.length}`);
  console.log("✅ Done");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
