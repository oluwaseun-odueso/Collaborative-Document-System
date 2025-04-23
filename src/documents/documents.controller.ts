import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
// import { GetDocumentDto } from "./dto/get-document.dto"
import { ValidateIdPipe } from './pipes/validate-object-id.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(@Body() createDto: CreateDocumentDto, @Request() req) {
    return this.documentsService.create(createDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ValidateIdPipe) id: string) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ValidateIdPipe) id: string) {
    await this.documentsService.remove(id);
    return { message: 'Document deleted successfully' };
  }
}
