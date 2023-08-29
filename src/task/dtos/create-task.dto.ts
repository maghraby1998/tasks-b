import { IsArray, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsArray()
  usersIds: number[];
}
