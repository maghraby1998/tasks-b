import { BadRequestException, Injectable } from '@nestjs/common';
import { Stage, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async findAll(auth: User) {
    const projectUser = await this.prisma.projectUser.findMany({
      where: {
        userId: auth.id,
      },
      include: {
        project: true,
      },
    });

    console.log(projectUser);

    const projects = projectUser.map((projectUser) => projectUser.project);

    return projects;
  }

  async createProject(auth: User, name: string, stages: Stage[] = []) {
    const project = await this.prisma.project.create({
      data: { name, created_at: new Date() },
    });

    await this.prisma.projectUser.create({
      data: {
        project: {
          connect: {
            id: project.id,
          },
        },
        user: {
          connect: {
            id: auth.id,
          },
        },
      },
    });

    if (stages.length) {
      const stagesToStore = stages.map((stage) => ({
        ...stage,
        projectId: project.id,
      }));

      await this.prisma.stage.createMany({
        data: stagesToStore,
      });
    }

    return project;
  }

  async updateProject(
    auth: User,
    projectId: number,
    name: string,
    stages: Stage[] = [],
  ) {
    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        name,
      },
    });

    stages.forEach(async (stage) => {
      await this.prisma.stage.update({
        where: { id: stage.id },
        data: stage,
      });
    });

    // await this.prisma.projectUser.create({
    //   data: {
    //     project: {
    //       connect: {
    //         id: project.id,
    //       },
    //     },
    //     user: {
    //       connect: {
    //         id: auth.id,
    //       },
    //     },
    //   },
    // });

    return project;
  }

  async findProjectStages(projectId: number) {
    return this.prisma.stage.findMany({
      where: {
        projectId,
      },
      include: { tasks: true },
    });
  }

  async findProjectUsers(projectId: number) {
    const projectUsers = await this.prisma.projectUser.findMany({
      where: {
        projectId,
      },
      include: {
        user: true,
      },
    });

    const users = projectUsers.map((projectUser) => projectUser.user);

    return users;
  }

  async findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  async addUserToProject(userId: number, projectId: number) {
    const projectUser = await this.prisma.projectUser.findFirst({
      where: {
        userId,
        projectId,
      },
    });

    if (projectUser) {
      throw new BadRequestException('user already belongs to that project');
    } else {
      await this.prisma.projectUser.create({
        data: {
          userId,
          projectId,
        },
      });

      return await this.prisma.project.findUnique({
        where: { id: projectId },
      });
    }
  }
}
