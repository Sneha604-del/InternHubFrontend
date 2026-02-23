import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FavoritesService } from '../../services/favorites.service';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-internships',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" (touchend)="onTouchEnd()">
      <div class="pull-indicator" [class.visible]="pullDistance > 0">
        <div class="pull-content">
          <i class="pi pi-refresh" [class.spin]="loading"></i>
          <span>{{pullDistance >= 80 ? 'Release to refresh' : 'Pull to refresh'}}</span>
        </div>
      </div>
      <div class="header-row">
        <h1>Internships at {{companyName}}</h1>
      </div>

      <div *ngIf="internships.length > 0" class="list">
        <div *ngFor="let internship of internships" class="item">
          <button class="fav-btn" (click)="toggleFavorite(internship)" [class.active]="isFavorite(internship.id)">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
            </svg>
          </button>
          <h2>{{internship.title}}</h2>

          <p><strong>Location:</strong> {{internship.location}}</p>
          <p><strong>Duration:</strong> {{internship.duration}}</p>
          <p><strong>Stipend:</strong> {{internship.stipend}}</p>
          <p *ngIf="internship.requiresPayment" class="app-fee"><strong>Application Fee:</strong> ₹{{internship.applicationFee || 0}}</p>
          <div class="badge" [class.paid]="internship.isPaid" [class.free]="!internship.isPaid">
            {{internship.isPaid ? 'PAID' : 'FREE'}}
          </div>

          <button class="btn" (click)="applyNow(internship.id)">Apply Now</button>
        </div>
      </div>

      <div *ngIf="internships.length === 0" class="empty-state">
        <p>No internships available</p>
      </div>


    </div>
  `,
  styles: [`
    .page { padding: 20px; max-width: 1200px; margin: 0 auto; min-height: 100%; background: #f5f5f5; padding-bottom: 100px; position: relative; }
    .pull-indicator { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; opacity: 0; transition: opacity 0.2s; }
    .pull-indicator.visible { opacity: 1; }
    .pull-content { display: flex; align-items: center; gap: 8px; color: white; padding: 10px 16px; font-size: 13px; font-weight: 600; white-space: nowrap; }
    .pull-content i { font-size: 16px; }
    .pull-content i.spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .header-row { margin-bottom: 20px; margin-top: 0; }
    h1 { margin: 0; font-size: 28px; font-weight: 600; color: #222; }

    .list { display: grid; gap: 20px; grid-template-columns: 1fr; }
    .item { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); position: relative; border-left: 5px solid #2196F3; transition: transform 0.2s, box-shadow 0.2s; }
    .item:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; margin: 12px 0; }
    .badge.paid { background: #4CAF50; color: white; }
    .badge.free { background: #FF9800; color: white; }
    .fav-btn { position: absolute; top: 16px; right: 16px; border: none; background: transparent; cursor: pointer; color: #ccc; transition: all 0.2s; z-index: 10; padding: 6px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
    .fav-btn:active { transform: scale(0.9); }
    .fav-btn.active { color: #4778ffff; }
    .item h2 { margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #222; padding-right: 60px; }

    .item p { margin: 10px 0; font-size: 16px; color: #555; line-height: 1.6; }
    .item strong { color: #222; font-weight: 600; }
    .app-fee { color: #2196F3; font-weight: 600; background: #E3F2FD; padding: 8px 12px; border-radius: 6px; }

    .btn { background: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; margin-top: 16px; width: 100%; font-weight: 500; transition: background 0.2s; }
    .btn:hover { background: #1976D2; }
    .empty-state { background: white; padding: 60px 20px; text-align: center; border-radius: 12px; }
    .empty-state p { margin: 0; color: #999; font-size: 18px; }


    @media (min-width: 640px) {
      .list { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 768px) {
      .page { padding: 24px; }
      h1 { font-size: 32px; margin: 32px 0; }
      .item { padding: 28px; }
      .item h2 { font-size: 24px; }
      .list { grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); }
      .fav-btn:hover { transform: scale(1.1); }
    }
  `]
})
export class InternshipsComponent implements OnInit {
  companyId: number = 0;
  companyName: string = '';
  internships: any[] = [];
  userGroup: any = null;
  loading = false;
  pullDistance = 0;
  startY = 0;
  isPulling = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private favoritesService: FavoritesService,
    private groupService: GroupService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.companyId = +params['companyId'];
      this.companyName = params['companyName'] || 'Company';
      if (this.companyId) {
        this.loadInternships();
      }
    });
    this.loadUserGroup();
  }

  loadUserGroup() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.groupService.getUserGroup(currentUser.id).subscribe({
        next: (group) => {
          this.userGroup = group;
        },
        error: (error) => {
          console.error('Error loading user group:', error);
        }
      });
    }
  }

  loadInternships() {
    this.loading = true;
    this.apiService.getInternshipsByCompany(this.companyId, this.companyName).subscribe({
      next: (response) => {
        this.internships = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading internships:', err);
        this.internships = [];
        this.loading = false;
      }
    });
  }

  applyNow(internshipId: number) {
    const queryParams: any = { 
      internshipId,
      companyId: this.companyId,
      companyName: this.companyName
    };
    
    if (this.userGroup) {
      queryParams.groupId = this.userGroup.id;
    }
    
    this.router.navigate(['/apply'], { queryParams });
  }

  toggleFavorite(internship: any) {
    this.favoritesService.toggleFavorite({ ...internship, companyName: this.companyName });
  }

  isFavorite(internshipId: number): boolean {
    return this.favoritesService.isFavorite(internshipId);
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
      this.loadInternships();
    }
    this.isPulling = false;
    this.pullDistance = 0;
  }
}