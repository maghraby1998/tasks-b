import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Notification, User } from '@prisma/client';
import { Auth } from 'src/decorators/auth.decorator';
import { UserService } from 'src/user/user.service';

@Resolver()
export class NotificationResolver {
  constructor(private userService: UserService) {}

  @Query('notifications')
  async notifications(@Auth() auth: User) {
    return [];
  }

  @ResolveField('user')
  async user(@Parent() notification: Notification) {
    return this.userService.findOne(notification.userId);
  }
}
