import { Injectable } from '@nestjs/common';
import { Stage } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const projects = await this.prisma.project.findMany();

    return projects;
  }

  async createProject(name: string, stages: Stage[] = []) {
    const project = await this.prisma.project.create({
      data: { name, created_at: new Date() },
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

  async findProjectStages(projectId: number) {
    return this.prisma.stage.findMany({
      where: {
        projectId,
      },
      include: { tasks: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }
}
