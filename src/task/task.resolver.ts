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
import { UserService } from 'src/user/user.service';

@Resolver('Task')
export class TaskResolver {
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
  ) {}

  @Query('task')
  async task(@Args('id', ParseIntPipe) id: number) {
    const task = await this.taskService.findTask(id);
    return task;
  }

  @ResolveField()
  async assignees(@Parent() task: Task) {
    return this.taskService.getTaskUsers(task.id);
  }

  @ResolveField()
  async createdBy(@Parent() task: Task) {
    return this.userService.findOne(task.created_by);
  }

  @ResolveField()
  async project(@Parent() task: Task) {
    return this.projectService.findOne(task.projectId);
  }

  @Mutation()
  async createTask(@Args('input') input: CreateTaskDto, @Auth() auth: User) {
    return this.taskService.createTask(input, auth);
  }

  @Mutation()
  async updateTaskStage(@Args('input') input: any) {
    return this.taskService.updateTaskStage(input?.taskId, input?.stageId);
  }

  @Mutation()
  async changeTaskName(@Args('id') id: number, @Args('name') name: string) {
    return this.taskService.changeTaskName(id, name);
  }

  @Mutation()
  async updateTask(
    @Args('input') input: { id: number; name: string; taskUsers: number[] },
  ) {
    return this.taskService.updateTask(+input.id, input.name, input.taskUsers);
  }
}
