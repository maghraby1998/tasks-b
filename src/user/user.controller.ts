import { Body, Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInputDto } from './dtos/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  test(@Body() body: CreateUserInputDto) {
    return 'hello woorld';
  }
}
