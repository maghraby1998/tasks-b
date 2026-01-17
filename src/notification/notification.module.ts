import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [
    NotificationService,
    NotificationResolver,
    UserService,
    PrismaService,
  ],
})
export class NotificationModule {}
