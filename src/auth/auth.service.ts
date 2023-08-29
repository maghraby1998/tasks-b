import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signUp(name: string, email: string, password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
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

    const payload = { userId: user.id };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      user,
      access_token,
    };
  }
}
