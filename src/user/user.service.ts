import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  getUserTasks(id: number) {
    return this.prisma.userTask.findMany({
      where: { userId: id },
      include: {
        task: {
          include: {
            users: {
              include: { user: true },
            },
          },
        },
      },
    });
  }
}
