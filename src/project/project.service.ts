import { BadRequestException, Injectable } from '@nestjs/common';
import { Stage, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async findAll(auth: User) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: auth.id,
      },
      include: {
        projects: true,
      },
    });

    return user.projects;
  }

  async createProject(
    auth: User,
    name: string,
    stages: Stage[] = [],
    users: number[] = [],
  ) {
    const projectNameExists = await this.prisma.project.findFirst({
      where: {
        name,
      },
    });

    if (!!projectNameExists.name) {
      throw new BadRequestException('Project name already exists');
    }

    const project = await this.prisma.project.create({
      data: {
        name,
        created_at: new Date(),
        users: {
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
    // if (users.length) {
    //   const userProjectData = users.map((id) => ({
    //     userId: id,
    //     projectId: project.id,
    //   }));
    //   await this.prisma.projectUser.createMany({
    //     data: userProjectData,
    //   });
    // }
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
    return this.prisma.user.findMany({
      where: {
        projects: {
          some: {
            id: projectId,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }
}
