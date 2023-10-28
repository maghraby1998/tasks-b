import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CreateUserInputDto } from 'src/user/dtos/create-user.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation()
  async createUser(@Args('input') input: CreateUserInputDto) {
    return this.authService.signUp(input.name, input.email, input.password);
  }

  @Mutation()
  signIn(@Args('input') input: { email: string; password: string }) {
    return this.authService.signIn(input.email, input.password);
  }

  @Mutation()
  signUp(
    @Args('input') input: { name: string; email: string; password: string },
  ) {
    return this.authService.signUp(input.name, input.email, input.password);
  }
}
