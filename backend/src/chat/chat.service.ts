import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'worker' | 'employer' | 'investor';
  content: string;
  type: 'text' | 'file' | 'zoom_invite';
  roomId: string;
  timestamp: Date;
  metadata?: any; // For zoom links, file URLs etc.
}

export interface ChatRoom {
  id: string;
  type: 'project' | 'investment' | 'support' | 'general';
  participants: string[]; // User IDs
  messages: ChatMessage[];
}

@Injectable()
export class ChatService {
  private rooms: Map<string, ChatRoom> = new Map();

  createRoom(
    roomId: string,
    type: 'project' | 'investment' | 'support' | 'general',
    participants: string[] = [],
  ) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        type,
        participants,
        messages: [],
      });
    }
    return this.rooms.get(roomId);
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  addMessage(
    roomId: string,
    senderId: string,
    senderName: string,
    role: any,
    content: string,
    type: 'text' | 'file' | 'zoom_invite' = 'text',
    metadata?: any,
  ) {
    const room = this.rooms.get(roomId);
    if (!room) {
      // Auto-create room if not exists (for prototypal speed)
      this.createRoom(roomId, 'general');
      return this.addMessage(
        roomId,
        senderId,
        senderName,
        role,
        content,
        type,
        metadata,
      );
    }

    const message: ChatMessage = {
      id: uuidv4(),
      senderId,
      senderName,
      senderRole: role,
      content,
      type,
      roomId,
      timestamp: new Date(),
      metadata,
    };

    room.messages.push(message);
    return message;
  }

  getMessages(roomId: string) {
    return this.rooms.get(roomId)?.messages || [];
  }

  getAllActiveRooms() {
    return Array.from(this.rooms.values()).map((r) => ({
      id: r.id,
      type: r.type,
      participantCount: r.participants.length,
      lastMessage: r.messages[r.messages.length - 1],
    }));
  }
}
