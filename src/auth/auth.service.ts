import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async signUp(name: string, email: string, password: string) {
    try {
      const checkEmail = await this.userService.findUserByEmail(email);

      if (!!checkEmail) {
        throw new BadRequestException('email already exists');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await this.mailerService.sendMail({
        to: email,
        subject: 'Verifying',
        // template: __dirname + '/../templates/email',
        // context: {
        //   name: 'some random name',
        // },
        html: await ejs.renderFile(
          path.resolve(__dirname + '/../templates/email.ejs'),
          {
            name,
            email,
          },
        ),
      });

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // const payload = { userId: user.id };

      // const access_token = await this.jwtService.signAsync(payload);

      // return {
      //   user,
      //   access_token
      // }

      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new BadRequestException('invalid email or password');
    }

    if (user && !user.email_verified) {
      throw new BadRequestException('your email is not verified');
    }

    const payload = { userId: user.id };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      user,
      access_token,
    };
  }

  async verifyEmail(email: string) {
    return this.prisma.user.update({
      where: { email },
      data: {
        email_verified: 1,
      },
    });
  }
}
