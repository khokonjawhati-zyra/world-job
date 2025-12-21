import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('groups')
  getGroups(@Query('location') location: string) {
    return this.communityService.getGroups(location);
  }

  @Post('groups/:id/join')
  joinGroup(@Param('id') id: string, @Body('userId') userId: string) {
    return this.communityService.joinGroup(id, userId);
  }

  @Post('groups/:id/update')
  postUpdate(
    @Param('id') id: string,
    @Body() body: { author: string; content: string },
  ) {
    return this.communityService.postUpdate(id, body.author, body.content);
  }

  @Get('mentorships')
  getMentorships(
    @Query('userId') userId: string,
    @Query('role') role: 'mentor' | 'mentee',
  ) {
    return this.communityService.getMentorships(userId, role);
  }

  @Post('mentorships/request')
  requestMentorship(
    @Body() body: { mentorId: string; menteeId: string; goal: string },
  ) {
    return this.communityService.requestMentorship(
      body.mentorId,
      body.menteeId,
      body.goal,
    );
  }

  @Post('mentorships/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'accepted' | 'rejected' | 'completed',
  ) {
    return this.communityService.updateMentorshipStatus(id, status);
  }
}
