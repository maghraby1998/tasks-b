import { IsEmail, IsString } from 'class-validator';

export class CreateUserInputDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
