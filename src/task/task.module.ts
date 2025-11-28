import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { PrismaService } from 'src/prisma.service';
import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    TaskService,
    TaskResolver,
    PrismaService,
    ProjectService,
    UserService,
  ],
})
export class TaskModule {}
