import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string; role: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(
      `[ChatGateway] Client ${client.id} attempting to join room: ${data.roomId}`,
    );
    client.join(data.roomId);
    console.log(`[ChatGateway] Client ${client.id} JOINED room ${data.roomId}`);

    // Send history
    const history = this.chatService.getMessages(data.roomId);
    client.emit('roomHistory', history);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody()
    data: {
      roomId: string;
      senderId: string;
      senderName: string;
      role: any;
      content: string;
      type?: 'text' | 'file' | 'zoom_invite';
      metadata?: any;
    },
    @ConnectedSocket() client: Socket,
  ): void {
    const message = this.chatService.addMessage(
      data.roomId,
      data.senderId,
      data.senderName,
      data.role,
      data.content,
      data.type || 'text',
      data.metadata,
    );

    // Broadcast to the specific room
    this.server.to(data.roomId).emit('newMessage', message);

    // Broadcast notification to specific user (mocked via room broadcast for now or global admin channel)
    // Also emit to Admin Oversight room
    this.server.to('admin-oversight').emit('adminMonitorMessage', message);
  }

  @SubscribeMessage('joinAdminOversight')
  handleAdminJoin(@ConnectedSocket() client: Socket) {
    client.join('admin-oversight');
    client.emit('activeRooms', this.chatService.getAllActiveRooms());
  }

  @SubscribeMessage('scheduleMeeting')
  handleMeeting(
    @MessageBody() data: { roomId: string; senderId: string; topic: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Mock Zoom Link Generation
    const meetingUrl = `https://zoom.us/j/mock-meeting-${Date.now()}?pwd=secure`;
    const messageContent = `Join Zoom Meeting: ${data.topic}`;

    const message = this.chatService.addMessage(
      data.roomId,
      data.senderId,
      'System',
      'system',
      messageContent,
      'zoom_invite',
      { meetingUrl, topic: data.topic },
    );

    this.server.to(data.roomId).emit('newMessage', message);
    this.server.to('admin-oversight').emit('adminMonitorMessage', message);
  }
}
