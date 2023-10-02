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

    const projects = projectUser.map((projectUser) => projectUser.project);

    return projects;
  }

  async createProject(
    auth: User,
    name: string,
    stages: Stage[] = [],
    users: number[] = [],
  ) {
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

    if (users.length) {
      const userProjectData = users.map((id) => ({
        userId: id,
        projectId: project.id,
      }));
      await this.prisma.projectUser.createMany({
        data: userProjectData,
      });
    }

    return project;
  }

  async updateProject(
    projectId: number,
    name: string,
    stages: Stage[] = [],
    users: number[] = [],
  ) {
    const allProjectStages = await this.prisma.stage.findMany({
      where: { projectId },
    });

    allProjectStages.forEach(async (projectStage) => {
      const stage = stages.find((stage) => stage.id == projectStage.id);

      if (!!!stage) {
        await this.prisma.stage.delete({
          where: { id: projectStage.id },
        });
      }
    });

    if (stages.length) {
      stages.forEach(async (stage) => {
        if (stage.id) {
          await this.prisma.stage.update({
            where: { id: stage.id },
            data: stage,
          });
        } else {
          await this.prisma.stage.create({
            data: { ...stage, projectId },
          });
        }
      });
    }

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        name,
      },
    });

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    return project;
  }

  async findProjectStages(projectId: number) {
    return this.prisma.stage.findMany({
      where: {
        projectId,
      },
      orderBy: { order: 'asc' },
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
}
