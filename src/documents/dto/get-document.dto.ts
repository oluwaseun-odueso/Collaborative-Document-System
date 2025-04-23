import { IsUUID, IsNotEmpty } from 'class-validator';

export class GetDocumentDto {
  @IsUUID()
  @IsNotEmpty({ message: "Document ID is required" })
  id: string;
}