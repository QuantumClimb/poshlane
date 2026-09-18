import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fragrancesList = [
  {
    name: "Attrape-Rêves",
    brand: "Louis Vuitton",
    priceInr: 28500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Floral Amber",
    topNotes: "Bergamot, Ginger, Lychee",
    middleNotes: "Peony, Cacao, Rose",
    baseNotes: "Patchouli",
    description: "Attrape-Rêves by Louis Vuitton is a vibrant, magical fragrance where soft cacao notes blend with fresh peony and lychee.",
    imageFile: "LV-ATTRAPE-REVES.webp"
  },
  {
    name: "California Dream",
    brand: "Louis Vuitton",
    priceInr: 28500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Citrus Warm",
    topNotes: "Mandarin Orange",
    middleNotes: "Ambrette (Musk Mallow), Pear",
    baseNotes: "Benzoin, Musk",
    description: "California Dream by Louis Vuitton captures the colors and ecstasy of a sunset over the West Coast with glowing mandarin and warm benzoin.",
    imageFile: "LV_CALIFORNIA-DREAM.webp"
  },
  {
    name: "City of Stars",
    brand: "Louis Vuitton",
    priceInr: 28500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Citrus Floral",
    topNotes: "Blood Orange, Lemon, Red Mandarin, Bergamot, Lime",
    middleNotes: "Tiare Flower",
    baseNotes: "Powdery Notes, Musk, Sandalwood",
    description: "City of Stars by Louis Vuitton is an evening cologne celebrating Los Angeles nights with vibrant citrus and sensual tiare flower.",
    imageFile: "LV-CITY-OF-STARS.webp"
  },
  {
    name: "On The Beach",
    brand: "Louis Vuitton",
    priceInr: 28500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Citrus Aromatic",
    topNotes: "Yuzu, Neroli",
    middleNotes: "Thyme, Rosemary, Pink Pepper, Sandalwood",
    baseNotes: "Cypress",
    description: "On The Beach by Louis Vuitton evokes the brightness of summer with rare Japanese Yuzu fruit and soothing aromatic herbs.",
    imageFile: "LV-ON-THE-BEACH.webp"
  },
  {
    name: "Pacific Chill",
    brand: "Louis Vuitton",
    priceInr: 28500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Aromatic Fruity",
    topNotes: "Blackcurrant, Mint, Lemon, Citron, Coriander",
    middleNotes: "May Rose, Basil, Carrot Seeds",
    baseNotes: "Dates, Fig, Ambrette",
    description: "Pacific Chill by Louis Vuitton is a detoxifying, refreshing blend inspired by California's vibrant coast, featuring mint, lemon, and blackcurrant.",
    imageFile: "LV-PACIFIC_CHILL.webp"
  },
  {
    name: "Les Sables Roses",
    brand: "Louis Vuitton",
    priceInr: 32000,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Amber Floral",
    topNotes: "Rose, Oud",
    middleNotes: "Ambergris, Saffron",
    baseNotes: "Black Pepper",
    description: "Les Sables Roses by Louis Vuitton is an opulent contrast of hot desert sands and cool roses infused with rare natural Oud wood.",
    imageFile: "LV_LES-SABLES-ROSES.webp"
  },
  {
    name: "Ombre Nomade",
    brand: "Louis Vuitton",
    priceInr: 34000,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Oriental Woody",
    topNotes: "Agarwood (Oud), Incense",
    middleNotes: "Rose, Raspberry",
    baseNotes: "Birch, Amberwood, Benzoin",
    description: "Ombre Nomade by Louis Vuitton is an intense, mystical scent crafted around pure Oud Assam and smoky frankincense.",
    imageFile: "V-J-OMBRE-NOMADE.webp"
  },
  {
    name: "Bitter Peach",
    brand: "Tom Ford",
    priceInr: 27000,
    volume: 50,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Fruity Amber",
    topNotes: "Peach, Blood Orange, Cardamom, Heliotrope",
    middleNotes: "Rum, Cognac, Davana, Jasmine",
    baseNotes: "Indonesian Patchouli Leaf, Vanilla, Sandalwood, Tonka Bean",
    description: "Bitter Peach by Tom Ford is an intoxicating nectar of luscious peach steeped in rum and cognac, bursting with sensual richness.",
    imageFile: "Bitter-Peach.webp"
  },
  {
    name: "Electric Cherry",
    brand: "Tom Ford",
    priceInr: 27000,
    volume: 50,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Floral Fruity",
    topNotes: "Morello Cherry, Ginger",
    middleNotes: "Jasmine Sambac",
    baseNotes: "Ambrettolide, Pink Pepper",
    description: "Electric Cherry by Tom Ford combines luscious Morello cherry with spicy ginger and intoxicating Jasmine Sambac.",
    imageFile: "Electric-Cherry.webp"
  },
  {
    name: "Lost Cherry",
    brand: "Tom Ford",
    priceInr: 27000,
    volume: 50,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Amber Gourmand",
    topNotes: "Black Cherry, Cherry Liqueur, Bitter Almond",
    middleNotes: "Sour Cherry, Turkish Rose, Jasmine Sambac, Plum",
    baseNotes: "Peru Balsam, Tonka Bean, Sandalwood, Vetiver, Cedar",
    description: "Lost Cherry by Tom Ford is a full-bodied journey into forbidden temptation with ripe black cherry and roasted tonka bean.",
    imageFile: "Tom-Ford-Lost-Cherry.webp"
  },
  {
    name: "Vanilla Sex",
    brand: "Tom Ford",
    priceInr: 29000,
    volume: 50,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Amber Gourmand",
    topNotes: "Bitter Almond",
    middleNotes: "Vanilla, Floral Notes",
    baseNotes: "Vanilla Absolute, Ultravaniil™, Tonka Bean, Sandalwood",
    description: "Vanilla Sex by Tom Ford is an addictive, voluptuous fragrance showcasing deep vanilla tincture surrounded by soft florals.",
    imageFile: "Tom-Ford-Vanilla-Sex.webp"
  },
  {
    name: "Silver Mountain Water",
    brand: "Creed",
    priceInr: 26500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Fresh Citrus",
    topNotes: "Bergamot, Mandarin Orange",
    middleNotes: "Green Tea, Black Currant",
    baseNotes: "Musk, Petitgrain, Sandalwood, Galbanum",
    description: "Silver Mountain Water by Creed evokes crisp mountain streams in the Swiss Alps with pure green tea and citrus.",
    imageFile: "Silver-Mountain-Water.webp"
  },
  {
    name: "Bleu De Chanel",
    brand: "Chanel",
    priceInr: 14500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Male",
    fragranceFamily: "Woody Aromatic",
    topNotes: "Grapefruit, Lemon, Mint, Pink Pepper",
    middleNotes: "Ginger, Nutmeg, Jasmine, Iso E Super",
    baseNotes: "Incense, Vetiver, Cedar, Sandalwood, Patchouli, Labdanum, White Musk",
    description: "Bleu De Chanel is an iconic, timeless fragrance for the man who defies convention with a bold woody signature.",
    imageFile: "Bleu-De-Chanel.webp"
  },
  {
    name: "Coco Chanel",
    brand: "Chanel",
    priceInr: 15500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Oriental Spicy",
    topNotes: "Coriander, Mandarin Orange, Peach, Jasmine, Bulgarian Rose",
    middleNotes: "Mimosa, Cloves, Orange Blossom, Clover, Rose",
    baseNotes: "Amber, Sandalwood, Tonka Bean, Civet, Opoponax, Vanilla",
    description: "Coco Chanel Eau de Parfum is an elegant amber composition blending baroque warmth with delicate floral spices.",
    imageFile: "Coco_Chanel.webp"
  },
  {
    name: "1 Million",
    brand: "Paco Rabanne",
    priceInr: 8900,
    volume: 100,
    concentration: "Eau de Toilette",
    gender: "Male",
    fragranceFamily: "Woody Spicy",
    topNotes: "Blood Mandarin, Grapefruit, Mint",
    middleNotes: "Cinnamon, Rose, Spicy Notes",
    baseNotes: "Amber, Leather, Woody Notes, Indian Patchouli",
    description: "1 Million by Paco Rabanne is a seductive, flamboyant scent featuring cinnamon, blood mandarin, and rich leather.",
    imageFile: "1-Million.webp"
  },
  {
    name: "Lady Million",
    brand: "Paco Rabanne",
    priceInr: 8900,
    volume: 80,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Floral Woody",
    topNotes: "Raspberry, Neroli, Amalfi Lemon",
    middleNotes: "Jasmine, African Orange Flower, Gardenia",
    baseNotes: "White Honey, Patchouli, Amber",
    description: "Lady Million by Paco Rabanne is ultra-feminine, glamorous, and addictive with sweet white honey and glowing jasmine.",
    imageFile: "Lady-Million.webp"
  },
  {
    name: "Acqua Di Gio",
    brand: "Giorgio Armani",
    priceInr: 11500,
    volume: 100,
    concentration: "Eau de Toilette",
    gender: "Male",
    fragranceFamily: "Aromatic Aquatic",
    topNotes: "Lime, Lemon, Bergamot, Jasmine, Orange, Neroli",
    middleNotes: "Sea Notes, Jasmine, Calone, Peach, Freesia, Rosemary",
    baseNotes: "White Musk, Cedar, Oakmoss, Patchouli, Amber",
    description: "Acqua Di Gio by Giorgio Armani is the gold standard of fresh aquatic colognes, capturing Mediterranean sea air.",
    imageFile: "Acqua_DI_Gio.webp"
  },
  {
    name: "Because It's You",
    brand: "Emporio Armani",
    priceInr: 9800,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Floral Fruity",
    topNotes: "Raspberry, Neroli, Lemon",
    middleNotes: "Rose",
    baseNotes: "Vanilla, Musk, Amberwood",
    description: "Because It's You by Emporio Armani is a joyful, sparkling fragrance built on delicious raspberry, rose, and creamy vanilla.",
    imageFile: "Because-of-You.webp"
  },
  {
    name: "Sì Passione",
    brand: "Giorgio Armani",
    priceInr: 12000,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Floral Fruity",
    topNotes: "Pear, Blackcurrant, Pink Pepper, Grapefruit",
    middleNotes: "Rose, Jasmine, Heliotrope, Pineapple",
    baseNotes: "Vanilla, Cedar, Amberwood, Patchouli",
    description: "Sì Passione by Giorgio Armani is an uncompromising red bouquet for the confident woman who says yes to passion.",
    imageFile: "Si-Passione.webp"
  },
  {
    name: "Flora Gorgeous Gardenia",
    brand: "Gucci",
    priceInr: 12500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Floral Fruity",
    topNotes: "Pear Blossom, Red Berries, Italian Mandarin",
    middleNotes: "Gardenia, Jasmine, Frangipani",
    baseNotes: "Brown Sugar, Patchouli",
    description: "Flora Gorgeous Gardenia by Gucci is a cheerful floral signature built around white Gardenia and sweet brown sugar.",
    imageFile: "Gucci-Flora-Gardenia.webp"
  },
  {
    name: "Flora Gorgeous Jasmine",
    brand: "Gucci",
    priceInr: 12500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Floral Fresh",
    topNotes: "Italian Mandarin, Bergamot, Black Pepper",
    middleNotes: "Jasmine Grandiflorum, Magnolia, Damask Rose",
    baseNotes: "Australian Sandalwood, Benzoin, Patchouli",
    description: "Flora Gorgeous Jasmine by Gucci bursts with noble Jasmine Grandiflorum, soothing sandalwood, and sensual benzoin.",
    imageFile: "Gucci-Flora-Jasmine.webp"
  },
  {
    name: "Gucci Guilty",
    brand: "Gucci",
    priceInr: 11000,
    volume: 90,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Amber Floral",
    topNotes: "Pink Pepper, Mandarin Orange, Bergamot",
    middleNotes: "Lilac, Peach, Jasmine, Raspberry, Geranium",
    baseNotes: "White Musk, Amber, Patchouli, Vanilla",
    description: "Gucci Guilty Eau de Parfum is an oriental floral scent radiating freedom, featuring spiced pink pepper and rich lilac.",
    imageFile: "Gucci-Guilty.webp"
  },
  {
    name: "Black Opium",
    brand: "Yves Saint Laurent",
    priceInr: 12500,
    volume: 90,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Amber Gourmand",
    topNotes: "Pear, Pink Pepper, Orange Blossom",
    middleNotes: "Coffee, Jasmine, Bitter Almond, Licorice",
    baseNotes: "Vanilla, Patchouli, Cashmere Wood, Cedar",
    description: "Black Opium by YSL is a seductive coffee-rich floral scent filled with energy, sweet vanilla, and white flowers.",
    imageFile: "YSL-Black-Opium.webp"
  },
  {
    name: "Mon Paris",
    brand: "Yves Saint Laurent",
    priceInr: 11800,
    volume: 90,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Chypre Fruity",
    topNotes: "Strawberry, Raspberry, Pear, Orange, Tangerine, Calabrian Bergamot",
    middleNotes: "Peony, Jasmine Sambac, Chinese Jasmine, Datura, Orange Blossom",
    baseNotes: "Indonesian Patchouli Leaf, White Musk, Vanilla, Cedar, Moss",
    description: "Mon Paris by YSL is a modern romantic scent inspired by Paris, featuring sweet red berries and hypnotic datura flower.",
    imageFile: "YSL-MON-PARIS.webp"
  },
  {
    name: "Boss Bottled Silver",
    brand: "Hugo Boss",
    priceInr: 8500,
    volume: 100,
    concentration: "Eau de Toilette",
    gender: "Male",
    fragranceFamily: "Woody Spicy",
    topNotes: "Apple, Plum, Bergamot, Lemon",
    middleNotes: "Cinnamon, Mahogany, Carnation",
    baseNotes: "Vanilla, Sandalwood, Cedar, Vetiver",
    description: "Boss Bottled Silver Edition is a classic masculine scent of crisp red apple, warm cinnamon, and precious woods.",
    imageFile: "Hugo_Boss_Silver.webp"
  },
  {
    name: "Burberry Eau de Parfum",
    brand: "Burberry",
    priceInr: 9200,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Fruity Floral",
    topNotes: "Peach, Apricot, Pear, Black Currant, Green Apple",
    middleNotes: "Jasmine, Sandalwood, Moss",
    baseNotes: "Vanilla, Cedar, Musk",
    description: "Burberry Eau de Parfum is simple and charming, combining juicy peach and apricot with warm sandalwood.",
    imageFile: "Burberry.webp"
  },
  {
    name: "Fleur Musc",
    brand: "Narciso Rodriguez",
    priceInr: 10200,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Floral Woody Musk",
    topNotes: "Pink Pepper",
    middleNotes: "Rose, Musk, Peony",
    baseNotes: "Patchouli, Violet, Amber",
    description: "Fleur Musc for Her by Narciso Rodriguez embodies vibrant passion with spicy pink pepper, rose bouquet, and signature musk.",
    imageFile: "Fleur-Musc.webp"
  },
  {
    name: "Tam Dao",
    brand: "Diptyque",
    priceInr: 16500,
    volume: 75,
    concentration: "Eau de Parfum",
    gender: "Unisex",
    fragranceFamily: "Woody Floral",
    topNotes: "Italian Cypress, Myrtle, Rose",
    middleNotes: "Sandalwood, Cedar",
    baseNotes: "Brazilian Rosewood, Amber, White Musk",
    description: "Tam Dao by Diptyque is a tribute to Goa sandalwood, capturing sacred woody forests of Indochina with creaminess and cedar.",
    imageFile: "Tam-Dao-Diptyque.webp"
  },
  {
    name: "Kyoto",
    brand: "Diptyque",
    priceInr: 17000,
    volume: 100,
    concentration: "Eau de Toilette",
    gender: "Unisex",
    fragranceFamily: "Floral Amber",
    topNotes: "Incense, Rose, Vetiver",
    middleNotes: "Beetroot, Earthy Notes",
    baseNotes: "Amberwood",
    description: "Kyoto by Diptyque is a unique limited composition blending Japanese ikebana art, dark rose, incense, and earthy beetroot.",
    imageFile: "Tam-Dao-Kyoto.webp"
  },
  {
    name: "Bombshell",
    brand: "Victoria's Secret",
    priceInr: 6500,
    volume: 100,
    concentration: "Eau de Parfum",
    gender: "Female",
    fragranceFamily: "Fruity Floral",
    topNotes: "Passionfruit, Grapefruit, Pineapple, Tangerine, Big Strawberry",
    middleNotes: "Peony, Vanilla Orchid, Red Berries, Jasmine, Lily-of-the-Valley",
    baseNotes: "Musk, Woody Notes, Oakmoss",
    description: "Bombshell by Victoria's Secret is America's #1 fragrance, blending purple passion fruit with Shangri-La yellow peony.",
    imageFile: "Victoria_Secret_Bombshell.webp"
  }
];

const electronicsList = [
  {
    name: "AMOLED Smartwatch",
    brand: "TechFit",
    priceInr: 3999,
    description: "High-definition AMOLED Display Smartwatch with heart rate monitoring, bluetooth calling, 100+ sports modes, and 7-day battery life.",
    imageFile: "AMOLED-Watch.webp"
  },
  {
    name: "Kalobee Smartwatch",
    brand: "Kalobee",
    priceInr: 3499,
    description: "Sleek Kalobee Smartwatch featuring HD touchscreen display, health sensors, custom watch faces, and water resistance.",
    imageFile: "Kalobee.webp"
  },
  {
    name: "Marv Neo Smartwatch (Black)",
    brand: "Marv",
    priceInr: 2499,
    description: "Marv Neo Smartwatch in Matte Black with ultra-bright display, dual-mode Bluetooth calling, and continuous SPO2 tracking.",
    imageFile: "MARV-NEO-Black.webp"
  },
  {
    name: "Vega Neo Smartwatch",
    brand: "Vega",
    priceInr: 2999,
    description: "Vega Neo Premium Smartwatch featuring metallic casing, wireless charging, AI voice assistant support, and sleep tracking.",
    imageFile: "Vega-NEO.webp"
  },
  {
    name: "Tork Smartwatch",
    brand: "Tork",
    priceInr: 2799,
    description: "Tork Rugged Fitness Smartwatch with outdoor navigation assistance, multi-sport tracking, and durable alloy casing.",
    imageFile: "TORK.webp"
  },
  {
    name: "Shkod Wireless Earbuds (Black)",
    brand: "Shkod",
    priceInr: 1999,
    description: "Shkod True Wireless Earbuds in Stealth Black featuring deep bass drivers, low-latency gaming mode, and 30-hour total playback.",
    imageFile: "SHKOD-Black.webp"
  },
  {
    name: "Shkod Wireless Earbuds (Grey)",
    brand: "Shkod",
    priceInr: 1999,
    description: "Shkod True Wireless Earbuds in Slate Grey with clear voice quad-mics, IPX5 sweat resistance, and instant fast pairing.",
    imageFile: "SHKOD-GREY.webp"
  },
  {
    name: "Skullcandy Push Active",
    brand: "Skullcandy",
    priceInr: 6999,
    description: "Skullcandy Push Active True Wireless Sport Earbuds with hands-free voice control, secure fit earhooks, and IP55 sweat resistance.",
    imageFile: "Skullcandy-Push-Active.webp"
  },
  {
    name: "Skullcandy Sesh ANC",
    brand: "Skullcandy",
    priceInr: 5499,
    description: "Skullcandy Sesh ANC Noise-Canceling True Wireless Earbuds featuring active noise canceling, Stay-Aware mode, and 46 hours battery life.",
    imageFile: "Skullcandy-SESH-ANC.webp"
  }
];

async function main() {
  console.log('🚀 Starting Database Purge & Stock Replacement...');

  try {
    // 1. Purge existing tables in foreign key order
    console.log('🗑️ Purging existing products, fragrances, and categories...');
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.masterFragrance.deleteMany({});
    await prisma.productCategory.deleteMany({});

    console.log('✅ Purge complete!');

    // 2. Create Categories
    console.log('📁 Creating Categories: Fragrances & Electronics...');
    const fragrancesCategory = await prisma.productCategory.create({
      data: { name: 'Fragrances' }
    });
    const electronicsCategory = await prisma.productCategory.create({
      data: { name: 'Electronics' }
    });

    console.log(`✅ Categories created (Fragrances ID: ${fragrancesCategory.id}, Electronics ID: ${electronicsCategory.id})`);

    // 3. Insert Fragrances
    console.log('🌸 Inserting Fragrance Products...');
    let fragranceCount = 0;
    for (const f of fragrancesList) {
      const pricePaise = f.priceInr * 100;
      await prisma.product.create({
        data: {
          name: f.name,
          brand: f.brand,
          description: f.description,
          price: pricePaise,
          volume: f.volume,
          concentration: f.concentration,
          gender: f.gender,
          fragranceFamily: f.fragranceFamily,
          topNotes: f.topNotes,
          middleNotes: f.middleNotes,
          baseNotes: f.baseNotes,
          stockQuantity: 25,
          inStock: true,
          imageUrl: `/final_stock/${f.imageFile}`,
          categoryId: fragrancesCategory.id
        }
      });
      fragranceCount++;
    }
    console.log(`✅ Inserted ${fragranceCount} Fragrances.`);

    // 4. Insert Electronics
    console.log('⚡ Inserting Electronics Products...');
    let electronicsCount = 0;
    for (const e of electronicsList) {
      const pricePaise = e.priceInr * 100;
      await prisma.product.create({
        data: {
          name: e.name,
          brand: e.brand,
          description: e.description,
          price: pricePaise,
          stockQuantity: 15,
          inStock: true,
          imageUrl: `/final_stock/${e.imageFile}`,
          categoryId: electronicsCategory.id
        }
      });
      electronicsCount++;
    }
    console.log(`✅ Inserted ${electronicsCount} Electronics.`);

    console.log('\n🎉 ALL PRODUCTS SUCCESSFULLY REPLACED!');
    console.log(`Total Categories: 2`);
    console.log(`Total Products: ${fragranceCount + electronicsCount}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
