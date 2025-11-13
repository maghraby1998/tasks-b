import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { bugsnag } from 'bugsnag.config';

@Catch()
export class BugsnagGraphqlExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext<{ req: any }>(); // GraphQL context
    const req = ctx.req;

    // Optional: Determine status code (default 500)
    const status =
      (exception as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR;

    // Notify Bugsnag
    bugsnag.notify(exception as Error, (event) => {
      // Request metadata
      if (req) {
        event.addMetadata('request', {
          method: req.method,
          url: req.url,
          headers: req.headers,
          body: req.body,
          query: req.query,
        });

        // User info if authenticated
        if (req.user) {
          event.setUser(
            req.user.id || undefined,
            req.user.email || undefined,
            req.user.name || undefined,
          );
        }
      }
    });

    // Optionally rethrow or return a standard error
    throw exception;
  }
}
