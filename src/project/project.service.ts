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

  async createProject(auth: User, name: string, stages: Stage[] = []) {
    const projectNameExists = await this.prisma.project.findFirst({
      where: {
        name,
      },
    });

    if (!!projectNameExists) {
      throw new BadRequestException('Project name already exists');
    }

    return this.prisma.project.create({
      data: {
        name,
        created_at: new Date(),
        users: {
          connect: {
            id: auth.id,
          },
        },
        stages: {
          create: stages ?? [],
        },
      },
    });
  }

  async updateProject(projectId: number, name: string, stages: Stage[] = []) {
    return await this.prisma.$transaction(async (tx) => {
      const projectNameExists = await tx.project.findFirst({
        where: { name },
      });

      if (projectNameExists) {
        throw new BadRequestException('Project name already exists');
      }

      const projectStages = await tx.stage.findMany({
        where: { projectId },
      });

      const stageIdsFromClient = stages
        .map((st) => Number(st.id))
        .filter(Boolean);

      const projectStagesToDelete = projectStages?.filter(
        (stage) => !stageIdsFromClient?.includes(stage?.id),
      );

      if (projectStagesToDelete?.length > 0) {
        await tx.stage.deleteMany({
          where: {
            id: {
              in: projectStagesToDelete?.map((stage) => stage?.id),
            },
          },
        });
      }

      return await tx.project.update({
        where: { id: projectId },
        data: {
          name,
          stages: {
            upsert: stages.map((stage) => ({
              where: { id: stage?.id ?? 0 },
              create: {
                name: stage.name,
                color: stage.color,
                order: stage.order,
              },
              update: {
                name: stage.name,
                color: stage.color,
                order: stage.order,
              },
            })),
          },
        },
      });
    });
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
