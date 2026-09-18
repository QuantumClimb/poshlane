import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('🔍 Verifying database inventory...');

  const categories = await prisma.productCategory.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  console.log(`\nCategories count: ${categories.length}`);
  for (const cat of categories) {
    console.log(` - ${cat.name}: ${cat._count.products} products`);
  }

  const sampleProducts = await prisma.product.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      brand: true,
      price: true,
      imageUrl: true,
      category: { select: { name: true } }
    }
  });

  console.log('\nSample products inserted:');
  for (const p of sampleProducts) {
    console.log(` - [${p.category.name}] ${p.name} (${p.brand}) -> ₹${(p.price / 100).toLocaleString('en-IN')} | Image: ${p.imageUrl}`);
  }

  const lvProducts = await prisma.product.findMany({
    where: { brand: 'Louis Vuitton' },
    select: { name: true, price: true, imageUrl: true }
  });

  console.log(`\nLouis Vuitton products (${lvProducts.length}):`);
  for (const lv of lvProducts) {
    console.log(` - ${lv.name}: ₹${(lv.price / 100).toLocaleString('en-IN')} (${lv.imageUrl})`);
  }

  await prisma.$disconnect();
}

verify().catch(console.error);
