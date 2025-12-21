
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        const role = client.handshake.query.role as string;

        if (userId) {
            client.join(`user_${userId}`);
        }
        if (role) {
            client.join(`role_${role}`);
            // Also join ALL
            client.join('role_ALL');
        }
    }

    handleDisconnect(client: Socket) {
        // console.log(`Client disconnected: ${client.id}`);
    }

    sendToUser(userId: string, payload: any) {
        this.server.to(`user_${userId}`).emit('notification', payload);
    }

    broadcastToRole(role: string, payload: any) {
        if (role === 'ALL') {
            this.server.to('role_ALL').emit('notification', payload);
        } else {
            this.server.to(`role_${role}`).emit('notification', payload);
        }
    }
}
