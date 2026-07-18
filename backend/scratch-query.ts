import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.pricingPackage.findMany();
  console.log('--- PACKAGES ---');
  console.log(JSON.stringify(packages, null, 2));
  console.log('----------------');
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
