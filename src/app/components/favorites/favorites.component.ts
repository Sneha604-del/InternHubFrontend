import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" (touchend)="onTouchEnd()">
      <div class="pull-indicator" [class.visible]="pullDistance > 0">
        <div class="pull-content">
          <i class="pi pi-refresh"></i>
          <span>{{pullDistance >= 80 ? 'Release to refresh' : 'Pull to refresh'}}</span>
        </div>
      </div>
      <div class="header">
        <div>
          <h1>My Favorites</h1>
          <p>{{favorites.length}} saved internship{{favorites.length !== 1 ? 's' : ''}}</p>
        </div>
      </div>

      <div *ngIf="favorites.length === 0" class="empty">
        <i class="pi pi-heart" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
        <p>No favorite internships yet</p>
        <button class="btn" (click)="router.navigate(['/home'])">Browse Internships</button>
      </div>

      <div *ngIf="favorites.length > 0" class="grid">
        <div *ngFor="let internship of favorites" class="card">
          <button class="fav-btn active" (click)="removeFavorite(internship, $event)">
            <i class="pi pi-heart-fill"></i>
          </button>
          <h3>{{internship.title}}</h3>
          <p><strong>Company:</strong> {{internship.companyName}}</p>
          <p><strong>Location:</strong> {{internship.location}}</p>
          <p><strong>Duration:</strong> {{internship.duration}}</p>
          <p><strong>Stipend:</strong> {{internship.stipend}}</p>
          <span class="badge" [class.paid]="internship.isPaid">
            {{internship.isPaid ? 'PAID' : 'FREE'}}
          </span>
          <button class="btn" (click)="apply(internship)">Apply Now</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px 16px 100px; position: relative; }
    .pull-indicator { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; opacity: 0; transition: opacity 0.2s; }
    .pull-indicator.visible { opacity: 1; }
    .pull-content { display: flex; align-items: center; gap: 8px; color: white; padding: 10px 16px; font-size: 13px; font-weight: 600; white-space: nowrap; }
    .pull-content i { font-size: 16px; }
    .header { margin-bottom: 24px; margin-top: 0; }
    .header h1 { margin: 0 0 8px; font-size: 24px; font-weight: 700; }
    .header p { margin: 0; color: #666; }
    .empty { text-align: center; padding: 60px 20px; display: flex; flex-direction: column; align-items: center; }
    .empty p { margin: 0 0 20px; color: #666; font-size: 16px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: relative; }
    .fav-btn { position: absolute; top: 12px; right: 12px; background: white; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.2s; }
    .fav-btn i { font-size: 18px; color: #999; transition: all 0.2s; }
    .fav-btn.active i { color: #e74c3c; }
    .fav-btn:hover { transform: scale(1.1); }
    .card h3 { margin: 0 0 12px; font-size: 18px; padding-right: 40px; }
    .card p { margin: 8px 0; font-size: 14px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin: 12px 0; }
    .badge.paid { background: #4CAF50; color: white; }
    .badge:not(.paid) { background: #FF9800; color: white; }
    .btn { padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 12px; width: 100%; }
    @media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  pullDistance = 0;
  startY = 0;
  isPulling = false;

  constructor(
    public router: Router,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();
  }

  removeFavorite(internship: any, event: Event) {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(internship);
    this.loadFavorites();
  }

  apply(internship: any) {
    this.router.navigate(['/apply'], {
      queryParams: { 
        internshipId: internship.id, 
        companyId: internship.companyId, 
        companyName: internship.companyName 
      }
    });
  }

  onTouchStart(event: TouchEvent) {
    if (window.scrollY === 0) {
      this.startY = event.touches[0].clientY;
      this.isPulling = true;
    }
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isPulling) return;
    const currentY = event.touches[0].clientY;
    const distance = currentY - this.startY;
    if (distance > 0 && window.scrollY === 0) {
      this.pullDistance = Math.min(distance * 0.5, 100);
      if (this.pullDistance > 10) {
        event.preventDefault();
      }
    }
  }

  onTouchEnd() {
    if (this.pullDistance >= 80) {
      this.loadFavorites();
    }
    this.isPulling = false;
    this.pullDistance = 0;
  }
}
