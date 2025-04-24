import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DocumentsService } from './documents.service';
import { Injectable } from '@nestjs/common';

@Injectable()
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
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { documentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.documentId);
    client.emit('joinedRoom', { documentId: data.documentId });
    console.log(`Client ${client.id} joined room: ${data.documentId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { documentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.documentId);
    client.emit('leftRoom', { documentId: data.documentId });
    console.log(`Client ${client.id} left room: ${data.documentId}`);
  }

  @SubscribeMessage('documentUpdate')
  handleDocumentUpdate(
    @MessageBody() data: { documentId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast the updated content to everyone else in the room
    client.to(data.documentId).emit('documentUpdated', {
      documentId: data.documentId,
      content: data.content,
    });

    console.log(`Document ${data.documentId} updated by ${client.id}`);
  }

}
