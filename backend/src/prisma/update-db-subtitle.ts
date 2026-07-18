import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const homePage = await prisma.page.findUnique({ where: { slug: 'home' } });
  if (!homePage) {
    console.log('Home page not found!');
    return;
  }
  const heroSection = await prisma.pageSection.findUnique({
    where: { pageId_key: { pageId: homePage.id, key: 'hero' } }
  });
  if (!heroSection) {
    console.log('Hero section not found!');
    return;
  }

  let content: any = {};
  try {
    content = JSON.parse(heroSection.content);
  } catch (e) {
    console.log('Could not parse content', e);
  }

  if (content && content.ar) {
    content.ar.subtitle = 'نبدأ من هدفك، ونربط كل خدمة بالخطوة التي تقرّب مشروعك من النتيجة.';
  }

  await prisma.pageSection.update({
    where: { id: heroSection.id },
    data: {
      content: JSON.stringify(content)
    }
  });

  console.log('Database updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
