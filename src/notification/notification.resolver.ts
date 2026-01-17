import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Notification, User } from '@prisma/client';
import { Auth } from 'src/decorators/auth.decorator';
import { UserService } from 'src/user/user.service';
import { NotificationService } from './notification.service';

@Resolver()
export class NotificationResolver {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  @Query('notifications')
  async notifications(
    @Auth() auth: User,
    @Args('first') first: number,
    @Args('after') after?: number,
  ) {
    return this.notificationService.getUserNotifications(auth.id, first, after);
  }

  @Mutation('markNotificationsAsRead')
  async markNotificationAsRead(@Auth() auth: User) {
    return this.notificationService.markNotificationsAsRead(auth.id);
  }

  @ResolveField('user')
  async user(@Parent() notification: Notification) {
    return this.userService.findOne(notification.userId);
  }
}
