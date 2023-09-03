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

@Resolver('Project')
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

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
