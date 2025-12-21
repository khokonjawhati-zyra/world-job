import { Injectable } from '@nestjs/common';
import { CommunityGroup, MentorshipRequest } from './community.model';

@Injectable()
export class CommunityService {
  private groups: CommunityGroup[] = [
    new CommunityGroup(
      '1',
      'NY Tech Workers',
      'New York',
      'Local meetup and support for easy tech workers.',
      ['101', '102'],
      [
        {
          date: '2025-01-01',
          content: 'Happy New Year! Annual meetup on Jan 20.',
          author: 'Admin',
        },
      ],
    ),
    new CommunityGroup(
      '2',
      'Remote Devs Global',
      'Remote',
      'Sharing tips for remote work success.',
      ['101'],
      [],
    ),
    new CommunityGroup(
      '3',
      'London Creatives',
      'London',
      'Designers and Artists in London.',
      [],
      [],
    ),
  ];

  private mentorships: MentorshipRequest[] = [
    new MentorshipRequest(
      'm1',
      '101',
      '105',
      'accepted',
      'Learn React Best Practices',
      '1 month',
    ),
  ];

  // Groups
  getGroups(location?: string) {
    if (!location) return this.groups;
    return this.groups.filter(
      (g) =>
        g.location.toLowerCase().includes(location.toLowerCase()) ||
        g.location === 'Remote',
    );
  }

  joinGroup(groupId: string, userId: string) {
    const group = this.groups.find((g) => g.id === groupId);
    if (!group) throw new Error('Group not found');
    if (!group.members.includes(userId)) {
      group.members.push(userId);
    }
    return group;
  }

  postUpdate(groupId: string, author: string, content: string) {
    const group = this.groups.find((g) => g.id === groupId);
    if (!group) throw new Error('Group not found');

    group.updates.unshift({
      date: new Date().toISOString(),
      content,
      author,
    });
    return group;
  }

  // Mentorship
  requestMentorship(mentorId: string, menteeId: string, goal: string) {
    const newReq = new MentorshipRequest(
      Date.now().toString(),
      mentorId,
      menteeId,
      'pending',
      goal,
      'Undefined',
    );
    this.mentorships.push(newReq);
    return newReq;
  }

  getMentorships(userId: string, role: 'mentor' | 'mentee') {
    if (role === 'mentor')
      return this.mentorships.filter((m) => m.mentorId === userId);
    return this.mentorships.filter((m) => m.menteeId === userId);
  }

  updateMentorshipStatus(
    requestId: string,
    status: 'accepted' | 'rejected' | 'completed',
  ) {
    const req = this.mentorships.find((r) => r.id === requestId);
    if (req) req.status = status;
    return req;
  }
}
