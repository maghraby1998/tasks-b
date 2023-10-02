import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationResolver } from './invitation.resolver';
import { PrismaClient } from '@prisma/client';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [InvitationService, InvitationResolver, PrismaClient],
})
export class InvitationModule {}
