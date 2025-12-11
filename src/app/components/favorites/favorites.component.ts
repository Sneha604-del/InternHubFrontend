import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="header">
        <button class="back-btn" (click)="goBack()">‹</button>
        <h1>Favorite Internships</h1>
      </div>

      <div *ngIf="favorites.length > 0" class="list">
        <div *ngFor="let internship of favorites" class="item">
          <button class="fav-btn active" (click)="removeFavorite(internship)">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
            </svg>
          </button>
          <h2>{{internship.title}}</h2>
          <p><strong>Company:</strong> {{internship.companyName}}</p>
          <p><strong>Location:</strong> {{internship.location}}</p>
          <p><strong>Duration:</strong> {{internship.duration}}</p>
          <p><strong>Stipend:</strong> {{internship.stipend}}</p>
          <div class="badge" [class.paid]="internship.isPaid" [class.free]="!internship.isPaid">
            {{internship.isPaid ? 'PAID' : 'FREE'}}
          </div>
          <button class="review-btn" (click)="rateReview(internship)">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
            </svg>
            Rate & Review
          </button>
          <button class="btn" (click)="applyNow(internship.id)">Apply Now</button>
        </div>
      </div>

      <div *ngIf="favorites.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="64" height="64">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
          </svg>
        </div>
        <p>No favorite internships yet</p>
        <button class="browse-btn" (click)="browseInternships()">Browse Internships</button>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 12px; max-width: 900px; margin: 0 auto; min-height: 100vh; background: #f5f5f5; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .back-btn { width: 36px; height: 36px; border: none; background: white; border-radius: 8px; font-size: 24px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .back-btn:active { transform: scale(0.95); }
    h1 { margin: 0; font-size: 18px; font-weight: 600; color: #222; }

    .list { display: grid; gap: 12px; grid-template-columns: 1fr; }
    .item { background: white; padding: 14px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; margin: 8px 0; }
    .badge.paid { background: #4CAF50; color: white; }
    .badge.free { background: #FF9800; color: white; }
    .fav-btn { position: absolute; top: 10px; right: 10px; border: none; background: transparent; cursor: pointer; color: #ccc; transition: all 0.2s; z-index: 10; padding: 4px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
    .fav-btn:active { transform: scale(0.9); }
    .fav-btn.active { color: #2558e4ff; }
    .item h2 { margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #222; padding-right: 40px; }
    .item p { margin: 6px 0; font-size: 13px; color: #555; }
    .item strong { color: #222; font-weight: 500; }
    .review-btn { background: #FFA726; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 13px; cursor: pointer; margin-top: 10px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .review-btn:hover { background: #FB8C00; }
    .btn { background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 13px; cursor: pointer; margin-top: 8px; width: 100%; }
    .btn:hover { background: #1976D2; }

    .empty-state { background: white; padding: 60px 20px; text-align: center; border-radius: 8px; margin-top: 40px; }
    .empty-icon { color: #ddd; margin-bottom: 16px; display: flex; justify-content: center; }
    .empty-state p { margin: 0 0 20px 0; color: #999; font-size: 14px; }
    .browse-btn { background: #2196F3; color: white; border: none; padding: 10px 24px; border-radius: 4px; font-size: 14px; cursor: pointer; }
    .browse-btn:hover { background: #1976D2; }

    @media (min-width: 640px) {
      .list { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 768px) {
      .page { padding: 16px; }
      h1 { font-size: 20px; }
      .item { padding: 16px; }
      .item h2 { font-size: 16px; }
      .list { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
      .fav-btn:hover { transform: scale(1.1); }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  constructor(
    private router: Router,
    private favoritesService: FavoritesService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }

  removeFavorite(internship: any) {
    this.favoritesService.toggleFavorite(internship);
    this.loadFavorites();
    this.toastService.showInfo('Removed from favorites', 'Favorites');
  }

  applyNow(internshipId: number) {
    this.router.navigate(['/apply'], { queryParams: { internshipId } });
  }

  browseInternships() {
    this.router.navigate(['/home']);
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  rateReview(internship: any) {
    this.toastService.showInfo('Rating & Review feature coming soon!', 'Coming Soon');
  }
}
