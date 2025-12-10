import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-internships',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>Internships at {{companyName}}</h1>
      
      <div *ngIf="internships.length > 0" class="list">
        <div *ngFor="let internship of internships" class="item">
          <div class="badge" [class.paid]="internship.isPaid" [class.free]="!internship.isPaid">
            {{internship.isPaid ? 'PAID' : 'FREE'}}
          </div>
          <h2>{{internship.title}}</h2>
          <p><strong>Location:</strong> {{internship.location}}</p>
          <p><strong>Duration:</strong> {{internship.duration}}</p>
          <p><strong>Stipend:</strong> {{internship.stipend}}</p>
          <button class="btn" (click)="applyNow(internship.id)">Apply Now</button>
        </div>
      </div>
      
      <div *ngIf="internships.length === 0" class="empty-state">
        <p>No internships available</p>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 12px; max-width: 900px; margin: 0 auto; min-height: 100%; background: #f5f5f5; }
    h1 { margin: 16px 0; font-size: 18px; font-weight: 600; color: #222; text-align: center; }

    .list { display: grid; gap: 12px; grid-template-columns: 1fr; }
    .item { background: white; padding: 14px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative; }
    .badge { position: absolute; top: 10px; right: 10px; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .badge.paid { background: #4CAF50; color: white; }
    .badge.free { background: #FF9800; color: white; }
    .item h2 { margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #222; padding-right: 60px; }
    .item p { margin: 6px 0; font-size: 13px; color: #555; }
    .item strong { color: #222; font-weight: 500; }
    .btn { background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-size: 13px; cursor: pointer; margin-top: 10px; width: 100%; }
    .btn:hover { background: #1976D2; }
    .empty-state { background: white; padding: 40px 20px; text-align: center; border-radius: 8px; }
    .empty-state p { margin: 0; color: #999; font-size: 14px; }
    @media (min-width: 640px) {
      .list { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 768px) {
      .page { padding: 16px; }
      h1 { font-size: 20px; margin: 20px 0; }
      .item { padding: 16px; }
      .item h2 { font-size: 16px; }
      .list { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
    }
  `]
})
export class InternshipsComponent implements OnInit {
  companyId: number = 0;
  companyName: string = '';
  internships: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.companyId = +params['companyId'];
      this.companyName = params['companyName'] || 'Company';
      if (this.companyId) {
        this.loadInternships();
      }
    });
  }

  loadInternships() {
    this.apiService.getInternshipsByCompany(this.companyId, this.companyName).subscribe({
      next: (response) => {
        this.internships = response.data || response;
      },
      error: (err) => {
        console.error('Error loading internships:', err);
        this.internships = [];
      }
    });
  }

  applyNow(internshipId: number) {
    this.router.navigate(['/apply'], {
      queryParams: { internshipId }
    });
  }
}
