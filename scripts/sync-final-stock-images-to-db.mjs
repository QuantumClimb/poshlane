import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const FINAL_STOCK_DIR = path.join(__dirname, '..', 'public', 'final_stock');

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.webp':
      return 'image/webp';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'image/jpeg';
  }
}

async function syncImagesToDb() {
  console.log('🔄 Starting sync of images from public/final_stock to DB...');
  console.log('===========================================================');

  if (!fs.existsSync(FINAL_STOCK_DIR)) {
    console.error(`❌ Directory not found: ${FINAL_STOCK_DIR}`);
    process.exit(1);
  }

  const products = await prisma.product.findMany();
  console.log(`📦 Found ${products.length} products in DB.`);

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      if (!product.imageUrl) {
        console.log(`⚠️  Skipping Product ID ${product.id} (${product.name}): No imageUrl set`);
        skippedCount++;
        continue;
      }

      const fileName = path.basename(product.imageUrl);
      const filePath = path.join(FINAL_STOCK_DIR, fileName);

      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found for Product ID ${product.id} (${product.name}): ${filePath}`);
        skippedCount++;
        continue;
      }

      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString('base64');
      const mimeType = getMimeType(fileName);
      const fileSize = fileBuffer.length;

      await prisma.product.update({
        where: { id: product.id },
        data: {
          imageData: base64Data,
          imageMimeType: mimeType,
          imageSize: fileSize,
          updatedAt: new Date()
        }
      });

      updatedCount++;
      console.log(`✅ Updated ID ${product.id} [${product.name}] -> ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB, ${mimeType})`);

    } catch (err) {
      console.error(`❌ Error updating Product ID ${product.id} (${product.name}):`, err.message);
      errorCount++;
    }
  }

  // Also check MasterFragrance table if present
  const masters = await prisma.masterFragrance.findMany();
  if (masters.length > 0) {
    console.log(`\n🌸 Found ${masters.length} MasterFragrance records. Syncing...`);
    for (const master of masters) {
      if (!master.imageUrl) continue;
      const fileName = path.basename(master.imageUrl);
      const filePath = path.join(FINAL_STOCK_DIR, fileName);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        await prisma.masterFragrance.update({
          where: { id: master.id },
          data: {
            imageData: fileBuffer.toString('base64'),
            imageMimeType: getMimeType(fileName),
            imageSize: fileBuffer.length,
            updatedAt: new Date()
          }
        });
        console.log(`✅ Updated MasterFragrance ID ${master.id} [${master.name}]`);
      }
    }
  }

  console.log('\n📊 Summary:');
  console.log('====================');
  console.log(`Total Products Processed: ${products.length}`);
  console.log(`Successfully Updated:    ${updatedCount}`);
  console.log(`Skipped:                 ${skippedCount}`);
  console.log(`Errors:                  ${errorCount}`);

  await prisma.$disconnect();
}

syncImagesToDb().catch(async (e) => {
  console.error('Fatal error during sync:', e);
  await prisma.$disconnect();
  process.exit(1);
});
