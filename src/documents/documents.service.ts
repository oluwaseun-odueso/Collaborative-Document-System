import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from './models/document.model';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentHistory } from './models/document-history.model';
import { CreationAttributes } from 'sequelize';
import { createInstance } from "../common/helpers/sequelize.helpers"

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document) private documentModel: typeof Document,
    @InjectModel(DocumentHistory) private historyModel: typeof DocumentHistory,
  ) {}

  async create(
    createDto: CreateDocumentDto,
    ownerId: string,
  ): Promise<Document> {
    return this.documentModel.create(createDto as CreationAttributes<Document> & { ownerId: string });
  }

  async findAll(): Promise<Document[]> {
    return this.documentModel.findAll({
      include: ['owner', 'history', 'comments'],
    });
  }

  async findOne(id: string): Promise<Document> {
    const doc = await this.documentModel.findByPk(id, {
      include: ['owner', 'history', 'comments'],
    });

    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(id: string, updateDto: UpdateDocumentDto): Promise<Document> {
    const doc = await this.documentModel.findByPk(id);
    if (!doc) throw new NotFoundException('Document not found');

    await this.historyModel.create({
      documentId: doc.id,
      oldContent: doc.content,
      editedBy: updateDto.editorId,
    } as CreationAttributes<DocumentHistory>);

    if (updateDto.title) doc.title = updateDto.title;
    if (updateDto.content) doc.content = updateDto.content;

    await doc.save();
    return doc;
  }

  async remove(id: string): Promise<void> {
    const doc = await this.documentModel.findByPk(id);
    if(!doc) throw new NotFoundException('Document not found')
    await doc.destroy();
  }
}
