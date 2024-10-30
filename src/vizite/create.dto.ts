import { IsString, IsOptional, Length} from 'class-validator';

export class CreateViziteAMSDto {
  @IsString()
  subdiv: string;

  @IsString()
  specialitate: string;

  @IsOptional()
  @IsString()
  numeMedic?: string;

  @IsString()
  nrRow: string;

  @IsString()
  dataAdresarii: string;

  @IsString()
  @Length(13, 13) // Ensure idnpPacient has exactly 13 characters
  idnpPacient: string;

  @IsOptional()
  @IsString()
  numePrenumePacient?: string;

  @IsString()
  dataNasterePacient?: string;

  @IsOptional()
  @IsString()
  sexPacient?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50) // Ensure statutPacient is max 50 characters
  statutPacient?: string;

  @IsOptional()
  @IsString()
  adresaPacient?: string;

  @IsOptional()
  @IsString()
  diagnosticPacient?: string;

  @IsOptional()
  @IsString()
  tipVizita?: string;
}
