import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
// import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'maghraby1998@gmail.com',
          pass: 'cbne winl axoc okoc',
        },
      },
      defaults: {
        from: 'maghraby1998@gmail.com',
      },
      template: {
        dir: join(__dirname, '..', 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    // BullModule.registerQueue({
    //   name: 'mails',
    // }),
  ],
  providers: [MailService],
})
export class MailModule {}
