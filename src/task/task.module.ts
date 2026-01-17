import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { PrismaService } from 'src/prisma.service';
import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  providers: [
    TaskService,
    TaskResolver,
    PrismaService,
    ProjectService,
    UserService,
    NotificationService,
  ],
})
export class TaskModule {}
