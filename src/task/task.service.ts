import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAllTasks(user_ids: number[]) {
    const userTasks = await this.prisma.userTask.findMany({
      where: { userId: { in: user_ids } },
      include: {
        task: true,
      },
    });

    return userTasks.map((userTask) => userTask.task);
  }

  async findTask(id: number) {
    return this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  async getTaskUsers(taskId: number) {
    const userTasks = await this.prisma.userTask.findMany({
      where: { taskId },
      include: {
        user: {
          include: {
            tasks: {
              include: {
                task: true,
              },
            },
          },
        },
      },
    });

    return userTasks.map((userTask) => userTask.user);
  }

  async createTask(name: string, usersIds: number[]) {
    // const task = await this.prisma.task.create({
    //   data: {
    //     name,
    //     created_at: new Date(),
    //   },
    // });
    // const userTasks = usersIds.map((userId) => ({
    //   userId: +userId,
    //   taskId: task.id,
    // }));
    // await this.prisma.userTask.createMany({
    //   data: userTasks,
    // });
    // return task;
  }
}
