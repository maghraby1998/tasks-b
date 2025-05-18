import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'randomjwtsecretkeyshouldtakethistoenv',
      // signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, AuthResolver, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
