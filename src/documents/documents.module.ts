import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './models/document.model';
import { DocumentHistory } from './models/document-history.model';
import { DocumentComment } from './models/document-comment.model';
import { User } from '../users/user.model';
import { DocumentGateway } from './document.gateway';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Document,
      DocumentHistory,
      DocumentComment,
      User,
    ]),
  ],
  providers: [DocumentsService, DocumentGateway],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
