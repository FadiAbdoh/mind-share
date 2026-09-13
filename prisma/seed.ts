import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { slug: "coding", title: "Coding", img: "/coding.png" },
    { slug: "fashion", title: "Fashion", img: "/fashion.png" },
    { slug: "food", title: "Food", img: "/food.png" },
    { slug: "travel", title: "Travel", img: "/travel.png" },
    { slug: "culture", title: "Culture", img: "/culture.png" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });