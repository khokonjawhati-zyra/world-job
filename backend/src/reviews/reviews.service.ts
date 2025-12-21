import { Injectable } from '@nestjs/common';
import { Review } from './review.model';

@Injectable()
export class ReviewsService {
  private reviews: Review[] = [];

  create(review: Partial<Review>) {
    const newReview = new Review(
      Date.now().toString(),
      review.projectId || '',
      review.reviewerId || '',
      review.targetId || '',
      review.rating || 5,
      review.comment || '',
      new Date(),
    );
    this.reviews.push(newReview);
    return newReview;
  }

  findAll() {
    return this.reviews;
  }

  findByProject(projectId: string) {
    return this.reviews.filter((r) => r.projectId === projectId);
  }

  getAverageRating(userId: string) {
    const userReviews = this.reviews.filter((r) => r.targetId === userId);
    if (userReviews.length === 0) return 0;
    const sum = userReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / userReviews.length;
  }
}
