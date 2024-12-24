import { IsString, IsOptional, Length, IsNumber} from 'class-validator';

export class CreateTicheteDto {
  @IsNumber()
  nrRow: number;

  @IsString()
  subdiv: string;

  @IsString()
  codDiagnostic: string;

  @IsString()
  diagnostic: string;
  
  @IsString()
  dataAdresarii: string;

  @IsOptional()
  @IsString()
  numePrenumePacient?: string;

  @IsString()
  @Length(13, 13) // Ensure idnpPacient has exactly 13 characters
  idnpPacient: string;
  
  @IsOptional()
  @IsString()
  sexPacient?: string;

  @IsNumber()
  virsta: number;

  @IsString()
  dataNasterePacient?: string;

  @IsOptional()
  @IsString()
  adresaPacient?: string;

  @IsOptional()
  @IsString()
  medicDeFamilie?: string;

  @IsOptional()
  @IsString()
  efectuatDeMeidic?: string;

  @IsOptional()
  @IsString()
  cazNou?: string;

  @IsOptional()
  @IsString()
  dispensar?: string;
}