import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async getUserNotifications(userId: number, first: number, after?: number) {
    const tasks = await this.prismaService.notification.findMany({
      where: {
        userId,
      },
      cursor: after ? { id: after } : undefined,
      take: first + 1,
      skip: after ? 1 : 0,
      orderBy: { created_at: 'desc' },
    });

    const hasNextPage = tasks.length > first;
    const items = hasNextPage ? tasks.slice(0, -1) : tasks;

    return {
      notifications: items,
      pageInfo: {
        endCursor: items.length ? items[items.length - 1].id : null,
        hasNextPage,
      },
    };
  }

  async create(userId: number, title: string, message: string) {
    return this.prismaService.notification.create({
      data: {
        title,
        message,
        userId,
      },
    });
  }

  async createNotifications(
    notifications: { userId: number; title: string; message: string }[],
  ) {
    return this.prismaService.notification.createMany({
      data: notifications.map((notification) => ({
        title: notification.title,
        message: notification.message,
        userId: notification.userId,
      })),
    });
  }
}
