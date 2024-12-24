import { IsString, IsOptional, IsNumber} from 'class-validator';

export class viziteAMPdto {
  @IsString()
  start: string;

  @IsString()
  finish: string;

  @IsNumber()
  @IsOptional()
  i?: number;

  @IsNumber()
  @IsOptional()
  j?: number;
}