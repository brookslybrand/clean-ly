import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

async function seed() {
  const { email, chores, completedChores, choreIds, completedChoreIds } =
    createSeedData();

  // Cleanup database -- potentially need to make fault tolerant or more clear if something is messed
  try {
    // It's okay if these deletions fail, it's likely just because the data doesn't actually exist
    const deleteCompletedChore = prisma.completedChore
      .deleteMany({
        where: { id: { in: completedChoreIds } },
      })
      .catch(() => {});
    const deleteUser = prisma.user.delete({ where: { email } }).catch(() => {});
    // Completed chores need to be deleted before chores, due to foreign key constraint
    const deletedChore = prisma.chore
      .deleteMany({
        where: { id: { in: choreIds } },
      })
      .catch(() => {});
    await Promise.all([deleteCompletedChore, deleteUser, deletedChore]);
  } catch (error) {}

  // Create the seed data
  const newUser = prisma.user.create({ data: { email } });
  const newChores = chores.map((chore) => prisma.chore.create({ data: chore }));
  await prisma.$transaction([newUser, ...newChores]);

  // Chores have to be created first, since completed chores have a foreign key dependency
  const newCompletedChores = completedChores.map((data) =>
    prisma.completedChore.create({ data })
  );
  await prisma.$transaction(newCompletedChores);

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Seed data

function createSeedData() {
  const email = 'clean@ly.com';
  const now = new Date();

  const laundryId = 'seed-chore-1';
  const vacuumId = 'seed-chore-2';
  const mopId = 'seed-chore-3';

  const chores = [
    {
      id: laundryId,
      name: 'Wash sheets',
      cadenceDays: 7,
      description: 'Our dirty sheets',
    },
    {
      id: vacuumId,
      name: 'Vacuum house',
      cadenceDays: 4,
      description: 'Because we have dogs 🙃',
    },
    {
      id: mopId,
      name: 'Mop',
      cadenceDays: 8,
      description: "Can't get myself to do it more often than this",
    },
  ];

  const choreIds = chores.map(({ id }) => id);

  const completedLaundry1Id = 'seed-completed-chore-1';
  const completedLaundry2Id = 'seed-completed-chore-2';
  const completedVacuum1Id = 'seed-completed-chore-3';

  const completedChores = [
    {
      id: completedLaundry1Id,
      choreId: laundryId,
      completed: addDays(now, -10), // Completed a while ago
      notes: "They weren't _that_ dirty",
    },
    {
      id: completedLaundry2Id,
      choreId: laundryId,
      completed: addDays(now, -2), // Completed recently
      notes: "They weren't _that_ dirty",
    },
    {
      id: completedVacuum1Id,
      choreId: vacuumId,
      completed: addDays(now, -5), // Needs to be done again
      notes: "They weren't _that_ dirty",
    },
    // No mopping has been done
  ];

  const completedChoreIds = completedChores.map(({ id }) => id);

  return {
    email,
    now,
    chores,
    choreIds,
    completedChores,
    completedChoreIds,
  };
}
