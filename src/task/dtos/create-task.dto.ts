import { IsArray, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  projectId: number;

  @IsString()
  stageId: number;

  @IsArray()
  usersIds: number[];

  @IsString()
  description: string;
}
