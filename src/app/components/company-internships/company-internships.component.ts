import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-company-internships',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
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
    .container { max-width: 1200px; margin: 0 auto; padding: 20px 16px 100px; }
    .header { margin-bottom: 24px; }
    .header h1 { margin: 0 0 8px; font-size: 24px; font-weight: 700; }
    .header p { margin: 0; color: #666; }
    .loading, .empty { text-align: center; padding: 40px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .card h3 { margin: 0 0 12px; font-size: 18px; }
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
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
}
