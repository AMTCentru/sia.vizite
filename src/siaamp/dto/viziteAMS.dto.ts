import { IsString, IsOptional, IsNumber} from 'class-validator';

export class viziteAMSdto {
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
  
  @IsNumber()
  @IsOptional()
  k?: number;
}