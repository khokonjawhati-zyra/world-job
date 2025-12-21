import { Injectable } from '@nestjs/common';
import { Ticket } from './ticket.model';

@Injectable()
export class SupportService {
  private tickets: Ticket[] = [
    // Mock Data
    new Ticket(
      '1',
      '101',
      'worker',
      'Payment Issue',
      'My payment is pending for 3 days.',
      'high',
      'open',
      new Date(),
      'disp_001',
    ),
    new Ticket(
      '2',
      '202',
      'employer',
      'Bug in Job Post',
      'Cannot edit job description.',
      'medium',
      'in_progress',
      new Date(),
    ),
    new Ticket(
      '3',
      '303',
      'investor',
      'ROI Calculation',
      'How is the platform fee calculated?',
      'low',
      'open',
      new Date(),
    ),
  ];

  createTicket(
    userId: string,
    userType: 'worker' | 'employer' | 'investor',
    subject: string,
    description: string,
    priority: 'low' | 'medium' | 'high',
    disputeId?: string,
  ) {
    const newTicket = new Ticket(
      Date.now().toString(),
      userId,
      userType,
      subject,
      description,
      priority,
      'open',
      new Date(),
      disputeId,
    );
    this.tickets.push(newTicket);
    return newTicket;
  }

  findAll() {
    return this.tickets;
  }

  resolveTicket(id: string) {
    const ticket = this.tickets.find((t) => t.id === id);
    if (!ticket) throw new Error('Ticket not found');
    ticket.status = 'resolved';
    return ticket;
  }
}
