import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { Project } from 'src/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from '@prisma/client';

@Resolver('Project')
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query('project')
  async project(@Args('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  @Query('projects')
  async projects(@Auth() auth: User) {
    return this.projectService.findAll(auth);
  }

  @ResolveField()
  async stages(@Parent() project: Project) {
    return this.projectService.findProjectStages(project.id);
  }

  @ResolveField()
  async users(@Parent() project: Project) {
    return this.projectService.findProjectUsers(project.id);
  }

  @Mutation('upsertProject')
  async upsertProject(@Args('input') input: any, @Auth() auth: User) {
    return this.projectService.createProject(
      auth,
      input?.name,
      input?.stages,
      input?.users,
    );
  }

  @Mutation('updateProject')
  async updateProject(@Args('input') input: any, @Auth() auth: User) {
    return this.projectService.updateProject(
      input?.id,
      input?.name,
      input?.stages,
      input?.users,
    );
  }
}
