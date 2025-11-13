import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import { BugsnagGraphqlExceptionFilter } from './filters/bugsnag-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        let validations = {};

        errors.forEach((error) => {
          validations[error.property] = Object.values(error.constraints);
        });

        return new UserInputError('error', {
          extensions: { validations, category: 'validation' },
        });
      },
    }),
  );
  app.useGlobalFilters(new BugsnagGraphqlExceptionFilter());

  app.enableCors();
  await app.listen(5000);
}
bootstrap();
