import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { InvitationModule } from './invitation/invitation.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthGuard } from './guards/auth.guard';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
// import { BullModule } from '@nestjs/bullmq';
import { MailModule } from './mail/mail.module';
import { NotificationModule } from './notification/notification.module';
import { DateTimeScalar } from './date-time.scalar';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrometheusModule.register({
      path: '/mymetrics',
    }),
    ScheduleModule.forRoot(),
    UserModule,
    TaskModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
      },
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      graphiql: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'randomsecretkeyfornowishouldchangeitforlater',
      signOptions: { expiresIn: '1000s' },
    }),
    AuthModule,
    ProjectModule,
    InvitationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    // BullModule.forRoot({
    //   connection: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    MailModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    DateTimeScalar,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer) {
    consumer
      .apply(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 1 }))
      .forRoutes('*');
  }
}
