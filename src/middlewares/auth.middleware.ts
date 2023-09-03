import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async use(req: any, res: never, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')?.[1];

    const tokenPayload = this.jwtService.decode(token) as { userId: number };

    if (tokenPayload) {
      const userId = tokenPayload.userId;

      if (userId) {
        const user = await this.prismaService.user.findUnique({
          where: { id: userId },
        });
        req.auth = user;
      }
    }

    next();
  }
}
