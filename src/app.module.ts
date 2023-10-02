import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { InvitationModule } from './invitation/invitation.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule,
    TaskModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    JwtModule.register({
      global: true,
      secret: 'randomsecretkeyfornowishouldchangeitforlater',
      signOptions: { expiresIn: '1000s' },
    }),
    AuthModule,
    ProjectModule,
    InvitationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
