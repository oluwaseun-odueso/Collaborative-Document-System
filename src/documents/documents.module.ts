import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './models/document.model';
import { DocumentHistory } from './models/document-history.model';
import { DocumentComment } from './models/document-comment.model';
// import { DocumentGateway } from './documents.gateway';
import { User } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Document, DocumentHistory, DocumentComment, User])],
  // providers: [DocumentsService, DocumentGateway],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
