import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Auth = createParamDecorator(
  (authProperty: string, ctx: ExecutionContext) => {
    const auth = ctx.getArgByIndex(2).req?.auth;

    return authProperty ? auth && auth?.[authProperty] : auth;
  },
);
