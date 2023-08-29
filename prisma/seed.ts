import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const date = new Date();
  const users = await prisma.user.createMany({
    data: [
      { id: 1, name: 'user1', email: 'ahmed@gmail.com', password: '123456' },
      { id: 2, name: 'user2', email: 'ahmed1@gmail.com', password: '123456' },
      { id: 3, name: 'user3', email: 'ahmed2@gmail.com', password: '123456' },
    ],
  });

  const tasks = await prisma.task.createMany({
    data: [
      { name: 'task 1', created_at: date },
      { name: 'task 2', created_at: date },
      { name: 'task 3', created_at: date },
    ],
  });

  const userTasks = await prisma.userTask.createMany({
    data: [
      {
        id: 1,
        userId: 1,
        taskId: 1,
      },
      {
        id: 2,
        userId: 2,
        taskId: 2,
      },
      {
        id: 3,
        userId: 3,
        taskId: 3,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
