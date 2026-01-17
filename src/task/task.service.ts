import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { User } from '@prisma/client';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async findTask(id: number) {
    return this.prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  async getTaskUsers(taskId: number) {
    return this.prisma.user.findMany({
      where: {
        tasks: {
          some: {
            id: taskId,
          },
        },
      },
    });
  }

  async createTask(createTaskInput: CreateTaskDto, auth: User) {
    const task = await this.prisma.task.create({
      data: {
        name: createTaskInput.name,
        project: {
          connect: { id: +createTaskInput.projectId },
        },
        stage: {
          connect: {
            id: +createTaskInput.stageId,
          },
        },
        assignees: {
          connect: createTaskInput?.usersIds?.map((id) => ({ id: +id })),
        },
        creator: {
          connect: {
            id: auth?.id,
          },
        },
        description: createTaskInput.description,
      },
    });

    if (createTaskInput?.usersIds?.length) {
      const notifications = [];
      createTaskInput.usersIds?.forEach((userId) => {
        notifications.push({
          userId: +userId,
          title: 'New Task',
          message: task.name,
          another: 'sdf',
        });
      });

      await this.notificationService.createNotifications(notifications);
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

  async changeTaskName(id: number, name: string) {
    return this.prisma.task.update({
      where: { id },
      data: {
        name,
      },
    });
  }

  async changeTaskDescription(id: number, description: string) {
    return this.prisma.task.update({
      where: { id },
      data: {
        description,
      },
    });
  }

  async changeTaskStage(id: number, stageId: number) {
    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        stageId,
      },
    });
  }

  async assignUserToTask(taskId: number, userId: number) {
    const task = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assignees: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await this.notificationService.create(userId, 'New Task', task.name);

    return task;
  }

  async unAssignUserFromTask(taskId: number, userId: number) {
    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assignees: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  async deleteTask(id: number) {
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }

  async addDocument(id: number, document: FileUpload) {
    const documentName = `${id}-${new Date().toDateString()}-${document?.filename}`;

    document
      ?.createReadStream()
      .pipe(createWriteStream('./uploads/' + documentName));

    const newDocument = await this.prisma.document.create({
      data: {
        task: {
          connect: {
            id,
          },
        },
        name: documentName,
        path: '/uploads/' + documentName,
        created_at: new Date(),
      },
    });

    this.prisma.task.update({
      where: {
        id,
      },
      data: {
        documents: {
          connect: {
            id: newDocument.id,
          },
        },
      },
    });

    return newDocument;
  }

  async getTaskDocuments(taskId: number) {
    return this.prisma.document.findMany({
      where: {
        taskId,
      },
    });
  }

  async getTaskCardThumbnail(taskId: number) {
    const documents = await this.prisma.document.findMany({
      where: {
        taskId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return documents?.[0];
  }

  async deleteDocument(documentId: number) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    await fs.unlink(
      join(__dirname, '..', '..', '..', 'uploads', document.name),
    );

    return this.prisma.document.delete({
      where: {
        id: documentId,
      },
    });
  }
}
