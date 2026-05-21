import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing titles (for re-runs)
  await prisma.title.deleteMany({});

  // Seed titles by tier (10 per tier = 40 total)
  const bronzeTitles = [
    { name: "Rookie Scholar", tier: "BRONZE", order: 1 },
    { name: "Homework Hero", tier: "BRONZE", order: 2 },
    { name: "Focus Finder", tier: "BRONZE", order: 3 },
    { name: "Classroom Climber", tier: "BRONZE", order: 4 },
    { name: "Study Sprinter", tier: "BRONZE", order: 5 },
    { name: "Quiz Conqueror", tier: "BRONZE", order: 6 },
    { name: "Knowledge Builder", tier: "BRONZE", order: 7 },
    { name: "Academic Adventurer", tier: "BRONZE", order: 8 },
    { name: "Junior Strategist", tier: "BRONZE", order: 9 },
    { name: "Rising Intellectual", tier: "BRONZE", order: 10 },
  ];

  const silverTitles = [
    { name: "Focused Learner", tier: "SILVER", order: 1 },
    { name: "Honors Pathfinder", tier: "SILVER", order: 2 },
    { name: "Assignment Architect", tier: "SILVER", order: 3 },
    { name: "Academic Strategist", tier: "SILVER", order: 4 },
    { name: "GPA Guardian", tier: "SILVER", order: 5 },
    { name: "Critical Thinker", tier: "SILVER", order: 6 },
    { name: "Excellence Explorer", tier: "SILVER", order: 7 },
    { name: "Research Navigator", tier: "SILVER", order: 8 },
    { name: "Collegiate Candidate", tier: "SILVER", order: 9 },
    { name: "Distinguished Scholar", tier: "SILVER", order: 10 },
  ];

  const goldTitles = [
    { name: "Research Apprentice", tier: "GOLD", order: 1 },
    { name: "Lecture Navigator", tier: "GOLD", order: 2 },
    { name: "Thesis Tactician", tier: "GOLD", order: 3 },
    { name: "Discipline Specialist", tier: "GOLD", order: 4 },
    { name: "Analytical Scholar", tier: "GOLD", order: 5 },
    { name: "Independent Academic", tier: "GOLD", order: 6 },
    { name: "Honors Pursuer", tier: "GOLD", order: 7 },
    { name: "Graduate Pathfinder", tier: "GOLD", order: 8 },
    { name: "Academic Authority", tier: "GOLD", order: 9 },
    { name: "Scholar Elite", tier: "GOLD", order: 10 },
  ];

  const platinumTitles = [
    { name: "Knowledge Architect", tier: "PLATINUM", order: 1 },
    { name: "Career Catalyst", tier: "PLATINUM", order: 2 },
    { name: "Lifelong Luminary", tier: "PLATINUM", order: 3 },
    { name: "Mastery Mentor", tier: "PLATINUM", order: 4 },
    { name: "Breakthrough Builder", tier: "PLATINUM", order: 5 },
    { name: "Professional Sage", tier: "PLATINUM", order: 6 },
    { name: "Visionary Strategist", tier: "PLATINUM", order: 7 },
    { name: "Intellectual Pioneer", tier: "PLATINUM", order: 8 },
    { name: "Wisdom Architect", tier: "PLATINUM", order: 9 },
    { name: "Legacy Leader", tier: "PLATINUM", order: 10 },
  ];

  const allTitles = [
    ...bronzeTitles,
    ...silverTitles,
    ...goldTitles,
    ...platinumTitles,
  ];

  for (const titleData of allTitles) {
    await prisma.title.create({
      data: {
        name: titleData.name,
        tier: titleData.tier as any,
        description: `${titleData.name} — ${titleData.tier.charAt(0).toUpperCase() + titleData.tier.slice(1).toLowerCase()} tier achievement`,
        badge: null, // Badge URLs can be added later
      },
    });
  }

  console.log("✓ Created 40 titles (10 per tier)");
  console.log("  - 10 BRONZE tier titles");
  console.log("  - 10 SILVER tier titles");
  console.log("  - 10 GOLD tier titles");
  console.log("  - 10 PLATINUM tier titles");
  console.log("✓ Seeding complete");
}

main()
  .catch((e) => {
    console.error("✗ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
