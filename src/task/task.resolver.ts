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
import { PrismaService } from 'src/prisma.service';

@Resolver('Task')
export class TaskResolver {
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private prisma: PrismaService,
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

  @ResolveField()
  async stage(@Parent() task: Task) {
    return this.prisma.stage.findUnique({
      where: {
        id: task?.stageId,
      },
    });
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
  async changeTaskName(
    @Args('id', ParseIntPipe) id: number,
    @Args('name') name: string,
  ) {
    return this.taskService.changeTaskName(id, name);
  }

  @Mutation()
  async changeTaskDescription(
    @Args('id', ParseIntPipe) id: number,
    @Args('description') description: string,
  ) {
    return this.taskService.changeTaskDescription(id, description);
  }

  @Mutation()
  async updateTask(
    @Args('input') input: { id: number; name: string; taskUsers: number[] },
  ) {
    return this.taskService.updateTask(+input.id, input.name, input.taskUsers);
  }

  @Mutation()
  async changeTaskStage(
    @Args('id', ParseIntPipe) id: number,
    @Args('stageId', ParseIntPipe) stageId: number,
  ) {
    return this.taskService.changeTaskStage(id, stageId);
  }

  @Mutation()
  async assignUserToTask(
    @Args('taskId', ParseIntPipe) taskId: number,
    @Args('userId', ParseIntPipe) userId: number,
  ) {
    return this.taskService.assignUserToTask(taskId, userId);
  }

  @Mutation()
  async unAssignUserFromTask(
    @Args('taskId', ParseIntPipe) taskId: number,
    @Args('userId', ParseIntPipe) userId: number,
  ) {
    return this.taskService.unAssignUserFromTask(taskId, userId);
  }

  @Mutation()
  async deleteTask(@Args('id', ParseIntPipe) id: number) {
    return this.taskService.deleteTask(id);
  }
}
