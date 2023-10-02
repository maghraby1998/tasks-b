import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InvitationService } from './invitation.service';
import { Auth } from 'src/decorators/auth.decorator';
import { User, ProjectInvitations } from '@prisma/client';

@Resolver('Invitation')
export class InvitationResolver {
  constructor(private invitationService: InvitationService) {}

  @Query('sentInvitations')
  async sentInvitations(@Auth() auth: User) {
    return this.invitationService.getSentInvitations(auth.id);
  }

  @Query('receivedInvitations')
  async receivedInvitations(@Auth() auth: User) {
    return this.invitationService.getReceivedInvitations(auth.id);
  }

  @ResolveField()
  async sender(@Parent() invitation: ProjectInvitations) {
    return this.invitationService.findInvitationSender(invitation.id);
  }

  @ResolveField()
  async receiver(@Parent() invitation: ProjectInvitations) {
    return this.invitationService.findInvitationReceiver(invitation.id);
  }

  @ResolveField()
  async project(@Parent() invitation: ProjectInvitations) {
    return this.invitationService.findInvitationProject(invitation.id);
  }

  @Mutation('inviteUserToProject')
  async inviteUserToProject(
    @Auth() auth: User,
    @Args('input') input: { email: string; projectId: number },
  ) {
    return this.invitationService.inviteUserToProject(
      input.email,
      input.projectId,
      auth.id,
    );
  }

  @Mutation('acceptInvitation')
  async acceptInvitation(@Args('invitationId') invitationId: number) {
    return this.invitationService.acceptInvitation(invitationId);
  }

  @Mutation('rejectInvitation')
  async rejectInvitation(@Args('invitationId') invitationId: number) {
    return this.invitationService.rejectInvitation(invitationId);
  }

  @Mutation('cancelInvitation')
  async cancelInvitation(@Args('invitationId') invitationId: number) {
    return this.invitationService.cancelInvitation(invitationId);
  }
}
