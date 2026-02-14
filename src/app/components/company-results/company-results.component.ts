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
            <div class="logo">{{company.name.charAt(0).toUpperCase()}}</div>
            <div class="title">
              <h3>{{company.name}}</h3>
              <p *ngIf="company.category">{{company.category.name}}</p>
            </div>
          </div>

          <div class="card-body">
            <div *ngIf="company.industry" class="row">{{company.industry}}</div>
            <div *ngIf="company.contactPerson" class="row">👤 {{company.contactPerson}}</div>
            <div *ngIf="company.contactPhone" class="row">📞 <a [href]="'tel:' + company.contactPhone">{{company.contactPhone}}</a></div>
            <div *ngIf="company.email" class="row">✉️ <a [href]="'mailto:' + company.email">{{company.email}}</a></div>
            <div *ngIf="company.address" class="row">📍 <a [href]="'https://maps.google.com/?q=' + encodeURIComponent(company.address)" target="_blank">{{company.address}}</a></div>
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
      font-size: 18px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 12px 0;
    }

    .companies-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .company-card {
      background: white;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .company-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-color: #d1d5db;
    }

    .card-header {
      display: flex;
      gap: 10px;
      padding: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      align-items: center;
    }

    .logo {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .title {
      flex: 1;
      min-width: 0;
    }

    .title h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      word-break: break-word;
    }

    .title p {
      margin: 2px 0 0 0;
      font-size: 11px;
      opacity: 0.9;
    }

    .card-body {
      padding: 8px 10px;
      font-size: 12px;
      color: #4b5563;
    }

    .row {
      margin: 4px 0;
      line-height: 1.3;
      word-break: break-word;
    }

    .row a {
      color: #667eea;
      text-decoration: none;
    }

    .row a:hover {
      text-decoration: underline;
    }

    .card-actions {
      display: flex;
      gap: 6px;
      padding: 6px 3px 3px 3px;
    }

    .btn {
      flex: 1;
      border: none;
      padding: 7px 3px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 4px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-secondary {
      background: #f59e0b;
      color: white;
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    @media (min-width: 640px) {
      .companies-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
    }

    @media (min-width: 1024px) {
      .companies-section {
        margin: 0 auto 20px;
        max-width: 1200px;
        padding: 0 32px;
      }

      .companies-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
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
