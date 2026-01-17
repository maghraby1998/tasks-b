import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async getUserNotifications(userId: number) {
    return this.prismaService.notification.findMany({
      where: {
        userId,
      },
    });
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
