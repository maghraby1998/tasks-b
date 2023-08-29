import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TaskService } from './task.service';
import { CreateTaskInput, Task } from 'src/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';

@Resolver('Task')
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query('task')
  async task(@Args('id', ParseIntPipe) id: number) {
    const task = await this.taskService.findTask(id);
    return task;
  }

  @ResolveField()
  async users(@Parent() task: Task) {
    const userTasks = await this.taskService.getTaskUsers(task.id);
    return userTasks.map((userTask) => userTask.user);
  }

  @Mutation()
  async createTask(@Args('input') input: CreateTaskDto) {
    return this.taskService.createTask(input.name, input.usersIds);
  }
}
