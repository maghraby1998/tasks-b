import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import InvitationStatus from 'src/enums/invitation-status.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InvitationService {
  constructor(
    private prisma: PrismaClient,
    private userService: UserService,
  ) {}

  async getSentInvitations(userId: number) {
    const invitations = await this.prisma.projectInvitations.findMany({
      where: {
        senderId: userId,
      },
    });

    return invitations;
  }

  async getReceivedInvitations(userId: number) {
    const invitations = await this.prisma.projectInvitations.findMany({
      where: {
        receiverId: userId,
      },
    });

    return invitations;
  }

  async inviteUserToProject(email: string, projectId: number, authId: number) {
    const user = await this.userService.findUserByEmail(email);

    if (!user || (user && user.id === authId)) {
      throw new BadRequestException(
        "can't find a user with the provided email",
      );
    }

    // check if user already invited to the project

    const userInvitation = await this.prisma.projectInvitations.findMany({
      where: {
        projectId,
        receiverId: user.id,
        status: InvitationStatus.PENDING,
      },
    });

    if (userInvitation.length) {
      throw new BadRequestException('user already invited to this project');
    }

    // check if user already exists in the project
    const projectUser = await this.prisma.project.findFirst({
      where: { id: projectId, users: { some: { id: user.id } } },
    });

    if (projectUser) {
      throw new BadRequestException('user already exists in this project');
    }

    // finally create the invitation
    return this.prisma.projectInvitations.create({
      data: {
        sender: {
          connect: {
            id: authId,
          },
        },
        receiver: {
          connect: {
            id: user.id,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
        status: InvitationStatus.PENDING,
      },
    });
  }

  async findInvitationSender(invitationId: number) {
    const invitation = await this.prisma.projectInvitations.findUnique({
      where: {
        id: invitationId,
      },
    });

    return this.userService.findOne(invitation.senderId);
  }

  async findInvitationReceiver(invitationId: number) {
    const invitation = await this.prisma.projectInvitations.findUnique({
      where: {
        id: invitationId,
      },
    });

    return this.userService.findOne(invitation.receiverId);
  }

  async findInvitationProject(invitationId: number) {
    const invitation = await this.prisma.projectInvitations.findUnique({
      where: {
        id: invitationId,
      },
      include: {
        project: true,
      },
    });

    return invitation.project;
  }

  async acceptInvitation(invitationId: number) {
    const invitation = await this.prisma.projectInvitations.update({
      where: {
        id: invitationId,
      },
      data: {
        status: InvitationStatus.ACCEPTED,
      },
    });

    await this.addUserToProject(invitation.receiverId, invitation.projectId);

    return invitation;
  }

  async rejectInvitation(invitationId: number) {
    return this.prisma.projectInvitations.update({
      where: {
        id: invitationId,
      },
      data: {
        status: InvitationStatus.REJECTED,
      },
    });
  }

  async cancelInvitation(invitationId: number) {
    return this.prisma.projectInvitations.delete({
      where: {
        id: invitationId,
      },
    });
  }

  async addUserToProject(userId: number, projectId: number) {
    const projectUser = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        users: { some: { id: userId } },
      },
    });

    if (projectUser) {
      throw new BadRequestException('user already belongs to that project');
    } else {
      await this.prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return await this.prisma.project.findUnique({
        where: { id: projectId },
      });
    }
  }
}
