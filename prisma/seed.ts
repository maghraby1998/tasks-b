import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  const date = new Date();
  const users = await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'user1',
        email: 'ahmed@gmail.com',
        password: hashedPassword,
        email_verified: 1,
      },
      {
        id: 2,
        name: 'user2',
        email: 'ahmed1@gmail.com',
        password: hashedPassword,
        email_verified: 1,
      },
      {
        id: 3,
        name: 'user3',
        email: 'ahmed2@gmail.com',
        password: hashedPassword,
        email_verified: 1,
      },
    ],
  });

  const projects = await prisma.project.createMany({
    data: [
      { id: 1, name: 'project 1', created_at: new Date() },
      { id: 2, name: 'project 2', created_at: new Date() },
      { id: 3, name: 'project 3', created_at: new Date() },
    ],
  });

  const stages = await prisma.stage.createMany({
    data: [
      { id: 1, name: 'stage 1', projectId: 1, order: 1 },
      { id: 2, name: 'stage 2', projectId: 1, order: 2 },
      { id: 3, name: 'stage 3', projectId: 1, order: 3 },
    ],
  });

  // const tasks = await prisma.task.createMany({
  //   data: [
  //     { name: 'task 1', created_at: date, projectId: 1, stageId: 1 },
  //     { name: 'task 2', created_at: date, projectId: 1, stageId: 1 },
  //     { name: 'task 3', created_at: date, projectId: 1, stageId: 1 },
  //   ],
  // });
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
