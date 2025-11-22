import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TaskService } from './task.service';
import { ParseIntPipe } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Task, User } from '@prisma/client';
import { ProjectService } from 'src/project/project.service';

@Resolver('Task')
export class TaskResolver {
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
  ) {}

  @Query('tasks')
  async tasks(@Args('user_ids') user_ids: number[]) {
    const tasks = await this.taskService.findAllTasks(
      user_ids?.map((id) => +id),
    );
    return tasks;
  }

  @Query('task')
  async task(@Args('id', ParseIntPipe) id: number) {
    const task = await this.taskService.findTask(id);
    return task;
  }

  @ResolveField()
  async users(@Parent() task: Task) {
    return this.taskService.getTaskUsers(task.id);
  }

  @ResolveField()
  async project(@Parent() task: Task) {
    return this.projectService.findOne(task.projectId);
  }

  @Mutation()
  async createTask(@Args('input') input: CreateTaskDto) {
    return this.taskService.createTask(
      input.name,
      input.projectId,
      input.stageId,
      input.usersIds,
    );
  }

  @Mutation()
  async updateTaskStage(@Args('input') input: any) {
    return this.taskService.updateTaskStage(input?.taskId, input?.stageId);
  }

  @Mutation()
  async updateTask(
    @Args('input') input: { id: number; name: string; taskUsers: number[] },
  ) {
    return this.taskService.updateTask(+input.id, input.name, input.taskUsers);
  }
}
