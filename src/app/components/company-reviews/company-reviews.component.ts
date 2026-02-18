import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Component({
  selector: 'app-company-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reviews-container">
      <div class="header">
        <h2>Company Reviews</h2>
        <div class="stats" *ngIf="stats">
          <div class="rating">⭐ {{stats.averageRating}}/5</div>
          <div class="count">{{stats.reviewCount}} reviews</div>
        </div>
      </div>

      <div class="submit-section">
        <h3>Share Your Experience</h3>
        <div class="form">
          <div class="field">
            <label>Rating *</label>
            <div class="stars">
              <span *ngFor="let i of [1,2,3,4,5]" 
                    (click)="rating = i" 
                    [class.active]="i <= rating"
                    class="star">★</span>
            </div>
          </div>
          <div class="field">
            <label>Description *</label>
            <textarea [(ngModel)]="reviewDescription" rows="4" placeholder="Share your experience..."></textarea>
          </div>
          <button (click)="submitReview()" class="submit-btn">Submit Review</button>
        </div>
      </div>

      <div class="reviews-list">
        <h3>All Reviews</h3>
        <div *ngFor="let review of reviews" class="review-card">
          <div class="review-header">
            <div class="reviewer-info">
              <strong>{{review.student.fullName}}</strong>
              <span class="date">{{review.createdAt | date:'mediumDate'}}</span>
            </div>
            <div class="rating-stars">
              <span *ngFor="let i of [1,2,3,4,5]" [class.filled]="i <= review.rating">★</span>
            </div>
          </div>
          <p>{{review.description}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e2e8f0;
    }

    .header h2 {
      margin: 0;
      font-size: 24px;
    }

    .stats {
      display: flex;
      gap: 20px;
      font-size: 14px;
    }

    .rating {
      font-weight: 600;
      color: #667eea;
    }

    .submit-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .submit-section h3 {
      margin-top: 0;
      color: #1a202c;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field label {
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .stars {
      display: flex;
      gap: 8px;
      font-size: 28px;
    }

    .star {
      cursor: pointer;
      color: #ddd;
      transition: color 0.2s;
    }

    .star.active {
      color: #ffc107;
    }

    input, textarea {
      padding: 10px 12px;
      border: 2px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    input:focus, textarea:focus {
      border-color: #667eea;
      outline: none;
    }

    .submit-btn {
      padding: 10px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .reviews-list h3 {
      margin-top: 0;
      color: #1a202c;
    }

    .review-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .reviewer-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .reviewer-info strong {
      color: #1a202c;
      font-size: 14px;
    }

    .date {
      color: #718096;
      font-size: 12px;
    }

    .rating-stars {
      font-size: 16px;
      color: #ddd;
    }

    .rating-stars span.filled {
      color: #ffc107;
    }

    .review-card p {
      margin: 0;
      color: #4a5568;
      font-size: 14px;
      line-height: 1.5;
    }
  `]
})
export class CompanyReviewsComponent implements OnInit {
  companyId: number = 0;
  reviews: any[] = [];
  stats: any = null;
  rating: number = 0;
  reviewDescription: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.companyId = +this.route.snapshot.queryParams['companyId'];
    if (this.companyId) {
      this.loadReviews();
      this.loadStats();
    }
  }

  loadReviews() {
    this.http.get(`${environment.apiUrl}/api/reviews/company/${this.companyId}`).subscribe({
      next: (data: any) => {
        this.reviews = data;
      },
      error: (err) => console.error('Error loading reviews:', err)
    });
  }

  loadStats() {
    this.http.get(`${environment.apiUrl}/api/reviews/company/${this.companyId}/stats`).subscribe({
      next: (data: any) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  submitReview() {
    if (!this.rating || !this.reviewDescription) {
      alert('Please fill all fields');
      return;
    }

    const userStr = localStorage.getItem('user');
    let studentId = null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        studentId = user.id;
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }

    if (!studentId) {
      alert('Please login to submit a review');
      return;
    }

    const params = new URLSearchParams();
    params.append('companyId', this.companyId.toString());
    params.append('studentId', studentId.toString());
    params.append('rating', this.rating.toString());
    params.append('description', this.reviewDescription);

    this.http.post(`${environment.apiUrl}/api/reviews/submit?${params}`, null).subscribe({
      next: () => {
        alert('Review submitted successfully!');
        this.rating = 0;
        this.reviewDescription = '';
        this.loadReviews();
        this.loadStats();
      },
      error: (err) => console.error('Error submitting review:', err)
    });
  }
}
