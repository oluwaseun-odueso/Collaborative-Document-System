import { IsOptional, IsString } from 'class-validator';

export class UpdateDOcumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsString()
  editorId: string
}
