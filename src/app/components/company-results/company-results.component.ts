import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="companies-section" *ngIf="companies.length > 0">
      <h2>Available Companies</h2>
      <div class="companies-grid">
        <div *ngFor="let company of companies" class="company-card">
          <div class="card-header">
            <div class="logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="title">
              <h3>{{company.name}}</h3>
              <p *ngIf="company.category">{{company.category.name}}</p>
            </div>
          </div>

          <div class="card-body">
            <div *ngIf="company.industry" class="row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              {{company.industry}}
            </div>
            <div *ngIf="company.contactPerson" class="row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              {{company.contactPerson}}
            </div>
            <div *ngIf="company.contactPhone" class="row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <a [href]="'tel:' + company.contactPhone">{{company.contactPhone}}</a>
            </div>
            <div *ngIf="company.email" class="row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <a [href]="'mailto:' + company.email">{{company.email}}</a>
            </div>
            <div *ngIf="company.address" class="row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <a [href]="'https://maps.google.com/?q=' + encodeURIComponent(company.address)" target="_blank">{{company.address}}</a>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn btn-primary" (click)="onViewInternships(company)">View Internships</button>
            <button class="btn btn-secondary" (click)="onViewReviews(company)">⭐ Reviews</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .companies-section {
      margin: 0 16px 20px;
    }

    .companies-section h2 {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 16px 0;
    }

    .companies-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .company-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .company-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
      border-color: #2563eb;
    }

    .card-header {
      display: flex;
      gap: 10px;
      padding: 12px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-bottom: 1px solid #e5e7eb;
      align-items: center;
    }

    .logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
    }

    .logo svg {
      width: 22px;
      height: 22px;
      stroke: white;
    }

    .title {
      flex: 1;
      min-width: 0;
    }

    .title h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      word-break: break-word;
      line-height: 1.3;
    }

    .title p {
      margin: 3px 0 0 0;
      font-size: 11px;
      color: #2563eb;
      font-weight: 600;
    }

    .card-body {
      padding: 10px 12px;
      font-size: 12px;
      color: #475569;
      background: white;
    }

    .row {
      margin: 6px 0;
      line-height: 1.4;
      word-break: break-word;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .row:first-child {
      margin-top: 0;
    }

    .row:last-child {
      margin-bottom: 0;
    }

    .row svg {
      width: 16px;
      height: 16px;
      stroke: #64748b;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .row a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }

    .row a:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }

    .card-actions {
      display: flex;
      gap: 6px;
      padding: 10px 12px;
      background: #f8fafc;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      flex: 1;
      border: none;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 6px;
      letter-spacing: 0.3px;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
      box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
    }

    .btn-primary:hover {
      background: #1d4ed8;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: white;
      color: #2563eb;
      border: 1.5px solid #2563eb;
    }

    .btn-secondary:hover {
      background: #eff6ff;
      border-color: #1d4ed8;
      color: #1d4ed8;
    }

    .btn:active {
      transform: scale(0.98);
    }

    @media (min-width: 640px) {
      .companies-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 18px;
      }
    }

    @media (min-width: 1024px) {
      .companies-section {
        margin: 0 auto 24px;
        max-width: 1200px;
        padding: 0 32px;
      }

      .companies-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }

      .company-card:hover {
        transform: translateY(-4px);
      }
    }
  `]
})
export class CompanyResultsComponent {
  @Input() companies: any[] = [];
  @Output() viewInternships = new EventEmitter<any>();

  constructor(private router: Router) {}

  onViewInternships(company: any) {
    this.viewInternships.emit(company);
  }

  onViewReviews(company: any) {
    this.router.navigate(['/company-reviews'], { queryParams: { companyId: company.id } });
  }

  encodeURIComponent(str: string): string {
    return encodeURIComponent(str);
  }
}
