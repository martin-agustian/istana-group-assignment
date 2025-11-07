import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { faker } from '@faker-js/faker';

async function main() {
  const hashed = await bcrypt.hash('password', 10);

  const users = [
    { name: 'selamet', email: 'selamet@mailinator.com', password: hashed },
    { name: 'budi', email: 'budi@mailinator.com', password: hashed },
    { name: 'anton', email: 'anton@mailinator.com', password: hashed },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  // generate 20 produk dummy
  const products = Array.from({ length: 20 }).map(() => ({
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 10000, max: 200000 }),
    stock: faker.number.int({ min: 1, max: 100 }),
  }));

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log('Seed finish.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
