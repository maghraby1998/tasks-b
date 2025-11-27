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
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { AuthGuard } from './guards/auth.guard';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
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
        dir: __dirname + '/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    ProjectModule,
    InvitationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).forRoutes('*');
  // }
}
