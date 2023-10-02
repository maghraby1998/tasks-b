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

  async createTask(
    name: string,
    projectId: number,
    stageId: number,
    userIds: number[] = [],
  ) {
    const task = await this.prisma.task.create({
      data: {
        name,
        project: {
          connect: { id: +projectId },
        },
        stage: {
          connect: {
            id: +stageId,
          },
        },
        created_at: new Date(),
      },
    });

    if (userIds.length) {
      const userTaskData = userIds?.map((userId: number) => ({
        userId,
        taskId: task.id,
      }));

      await this.prisma.userTask.createMany({
        data: userTaskData,
      });
    }

    return task;
  }

  async updateTaskStage(taskId: number, stageId: number) {
    return this.prisma.task.update({
      where: { id: +taskId },
      data: { stageId: +stageId },
    });
  }

  async updateTask(id: number, name: string, taskUsers: number[]) {
    return this.prisma.task.update({
      where: { id },
      data: {
        name,
      },
    });
  }
}
