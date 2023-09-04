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

@Resolver('Project')
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query('project')
  async project(@Args('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  @Query('projects')
  async projects() {
    return this.projectService.findAll();
  }

  @ResolveField()
  async stages(@Parent() project: Project) {
    return this.projectService.findProjectStages(project.id);
  }

  @Mutation('upsertProject')
  async upsertProject(@Args('input') input: any) {
    return this.projectService.createProject(input?.name, input?.stages);
  }
}
