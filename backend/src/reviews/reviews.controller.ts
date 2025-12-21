import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() review: any) {
    return this.reviewsService.create(review);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.reviewsService.findByProject(projectId);
  }

  @Get('user/:userId/average')
  getAverageRating(@Param('userId') userId: string) {
    return { average: this.reviewsService.getAverageRating(userId) };
  }
}
