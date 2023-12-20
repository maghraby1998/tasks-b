import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { ParseIntPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  user(@Args('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @ResolveField()
  async tasks(@Parent() user: User) {
    const userTasks = await this.userService.getUserTasks(user.id);
    return userTasks.map((userTask) => userTask.task);
  }
}
