import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-company-internships',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" (touchend)="onTouchEnd()">
      <div class="pull-indicator" [class.visible]="pullDistance > 0">
        <div class="pull-content">
          <i class="pi pi-refresh" [class.spin]="loading"></i>
          <span>{{pullDistance >= 80 ? 'Release to refresh' : 'Pull to refresh'}}</span>
        </div>
      </div>
      <div class="header">
        <h1>{{companyName}}</h1>
        <p>Available Internships</p>
      </div>

      <div *ngIf="loading" class="loading">Loading...</div>

      <div *ngIf="!loading && internships.length === 0" class="empty">
        <p>No internships available</p>
      </div>

      <div *ngIf="!loading && internships.length > 0" class="grid">
        <div *ngFor="let internship of internships" class="card">
          <button class="fav-btn" (click)="toggleFavorite(internship, $event)" [class.active]="isFavorite(internship.id)">
            <i class="pi" [class.pi-heart]="!isFavorite(internship.id)" [class.pi-heart-fill]="isFavorite(internship.id)"></i>
          </button>
          <h3>{{internship.title}}</h3>
          <p><strong>Location:</strong> {{internship.location}}</p>
          <p><strong>Duration:</strong> {{internship.duration}}</p>
          <p><strong>Stipend:</strong> {{internship.stipend}}</p>
          <p *ngIf="internship.requiresPayment" class="app-fee"><strong>Application Fee:</strong> ₹{{internship.applicationFee || 0}}</p>
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
    .pull-content i.spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .header { margin-bottom: 24px; margin-top: 0; }
    .header h1 { margin: 0 0 8px; font-size: 24px; font-weight: 700; }
    .header p { margin: 0; color: #666; }
    .loading, .empty { text-align: center; padding: 40px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: relative; }
    .fav-btn { position: absolute; top: 12px; right: 12px; background: white; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.2s; }
    .fav-btn i { font-size: 18px; color: #999; transition: all 0.2s; }
    .fav-btn.active i { color: #e74c3c; }
    .fav-btn:hover { transform: scale(1.1); }
    .card h3 { margin: 0 0 12px; font-size: 18px; padding-right: 40px; }
    .card p { margin: 8px 0; font-size: 14px; }
    .app-fee { color: #667eea; font-weight: 600; background: #E8EAF6; padding: 8px 12px; border-radius: 6px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; margin: 12px 0; }
    .badge.paid { background: #4CAF50; color: white; }
    .badge:not(.paid) { background: #FF9800; color: white; }
    .btn { width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 12px; }
    @media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class CompanyInternshipsComponent implements OnInit {
  companyId = 0;
  companyName = '';
  internships: any[] = [];
  loading = true;
  pullDistance = 0;
  startY = 0;
  isPulling = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.companyId = +params['companyId'];
      this.companyName = params['companyName'] || 'Company';
      if (this.companyId) this.load();
    });
  }

  load() {
    this.apiService.getInternshipsByCompany(this.companyId, this.companyName).subscribe({
      next: (res) => { this.internships = res.data || res; this.loading = false; },
      error: () => { this.internships = []; this.loading = false; }
    });
  }

  apply(internship: any) {
    this.router.navigate(['/apply'], {
      queryParams: { internshipId: internship.id, companyId: this.companyId, companyName: this.companyName }
    });
  }

  isFavorite(internshipId: number): boolean {
    return this.favoritesService.isFavorite(internshipId);
  }

  toggleFavorite(internship: any, event: Event) {
    event.stopPropagation();
    this.favoritesService.toggleFavorite({ ...internship, companyId: this.companyId, companyName: this.companyName });
  }

  onTouchStart(event: TouchEvent) {
    if (window.scrollY === 0) {
      this.startY = event.touches[0].clientY;
      this.isPulling = true;
    }
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isPulling || this.loading) return;
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
    if (this.pullDistance >= 80 && !this.loading) {
      this.load();
    }
    this.isPulling = false;
    this.pullDistance = 0;
  }
}
