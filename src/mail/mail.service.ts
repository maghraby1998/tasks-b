import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

type args = { user: User; subject: string; template: string; context: any };

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendEmail({ user, subject, template, context }: args) {
    return this.mailerService.sendMail({
      to: user.email,
      subject,
      template,
      context,
    });
  }
}
