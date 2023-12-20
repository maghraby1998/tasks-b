import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation()
  signIn(@Args('input') input: { email: string; password: string }) {
    return this.authService.signIn(input.email, input.password);
  }

  @Mutation()
  signUp(@Args('input') input: SignUpDto) {
    return this.authService.signUp(input.name, input.email, input.password);
  }
}
