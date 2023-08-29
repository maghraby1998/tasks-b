import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findTask(id: number) {
    return this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  async getTaskUsers(taskId: number) {
    return this.prisma.userTask.findMany({
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
  }

  async createTask(name: string, usersIds: number[]) {
    const task = await this.prisma.task.create({
      data: {
        name,
        created_at: new Date(),
      },
    });

    const userTasks = usersIds.map((userId) => ({
      userId: +userId,
      taskId: task.id,
    }));

    await this.prisma.userTask.createMany({
      data: userTasks,
    });

    return task;
  }
}
