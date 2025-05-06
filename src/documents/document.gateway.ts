import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DocumentsService } from './documents.service';
import { Injectable } from '@nestjs/common';
import { WsAuthGuard } from '../auth/ws-auth.guard'; 

@Injectable()
@UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DocumentGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly documentsService: DocumentsService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const user = client.data.user;
    console.log(`Client connected: ${client.id}, User ID: ${user?.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { documentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(data.documentId);
    client.emit('joinedRoom', { documentId: data.documentId });
    console.log(`Client ${client.id} joined room: ${data.documentId}`);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { documentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(data.documentId);
    client.emit('leftRoom', { documentId: data.documentId });
    console.log(`Client ${client.id} left room: ${data.documentId}`);
  }

  @SubscribeMessage('documentUpdate')
  async handleDocumentUpdate(
    @MessageBody() data: { documentId: string; content: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.documentsService.autoSaveDocument(
      data.documentId,
      data.content,
      data.userId,
    );

    console.log(`Document ${data.documentId} updated and saved by ${client.id}`);

    client.to(data.documentId).emit('documentUpdated', {
      documentId: data.documentId,
      content: data.content,
    });

    client.emit('updateSuccess', { documentId: data.documentId });
  }

  @SubscribeMessage('autoSave')
  async handleAutoSave(
    @MessageBody()
    data: { documentId: string; content: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.documentsService.autoSaveDocument(
        data.documentId,
        data.content,
        data.userId,
      );

      client.emit('autoSaveSuccess', { documentId: data.documentId });
    } catch (err) {
      console.error('Auto-save failed:', err);
      client.emit('autoSaveError', { message: 'Auto-save failed' });
    }
  }
}
