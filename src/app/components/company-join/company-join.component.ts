import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CompanyService } from '../../services/company.service';
import { GroupService } from '../../services/group.service';
import { ToastService } from '../../services/toast.service';
import { Company } from '../../models/group.model';

@Component({
  selector: 'app-company-join',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  template: `
    <div class="company-join-container">
      <div class="header">
        <h1>Join a Company</h1>
        <p>Select a company to apply for internship with your group</p>
      </div>

      <div class="companies-grid" *ngIf="companies.length > 0">
        <div class="company-card" *ngFor="let company of companies">
          <p-card>
            <div class="company-info">
              <h3>{{ company.name }}</h3>
              <p class="industry" *ngIf="company.industry">{{ company.industry }}</p>
              <p class="description" *ngIf="company.description">{{ company.description }}</p>
              <div class="contact-info" *ngIf="company.contactPerson">
                <small>Contact: {{ company.contactPerson }}</small>
              </div>
            </div>
            <div class="actions">
              <p-button 
                label="Join Company" 
                icon="pi pi-plus"
                [loading]="loading === company.id"
                (onClick)="joinCompany(company.id)"
                styleClass="w-full">
              </p-button>
            </div>
          </p-card>
        </div>
      </div>

      <div class="no-companies" *ngIf="companies.length === 0 && !loadingCompanies">
        <p>No companies available at the moment.</p>
      </div>

      <div class="loading" *ngIf="loadingCompanies">
        <p>Loading companies...</p>
      </div>

      <div class="skip-section">
        <p-button 
          label="Skip for Now" 
          icon="pi pi-arrow-right"
          styleClass="p-button-text"
          (onClick)="skipJoin()">
        </p-button>
      </div>
    </div>
  `,
  styles: [`
    .company-join-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    .header p {
      color: #666;
      font-size: 16px;
    }
    
    .companies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    
    .company-card {
      height: 100%;
    }
    
    .company-info h3 {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    .industry {
      color: #667eea;
      font-weight: 500;
      margin-bottom: 12px;
    }
    
    .description {
      color: #666;
      line-height: 1.5;
      margin-bottom: 16px;
    }
    
    .contact-info {
      margin-bottom: 16px;
    }
    
    .contact-info small {
      color: #888;
    }
    
    .actions {
      margin-top: 16px;
    }
    
    .no-companies, .loading {
      text-align: center;
      padding: 48px;
      color: #666;
    }
    
    .skip-section {
      text-align: center;
      margin-top: 32px;
    }
  `]
})
export class CompanyJoinComponent implements OnInit {
  companies: Company[] = [];
  groupId: number = 0;
  loading: number | null = null;
  loadingCompanies = true;

  constructor(
    private companyService: CompanyService,
    private groupService: GroupService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.groupId = +params['groupId'];
      if (!this.groupId) {
        this.router.navigate(['/groups']);
        return;
      }
    });

    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
        this.loadingCompanies = false;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.toastService.showError('Failed to load companies', 'Error');
        this.loadingCompanies = false;
      }
    });
  }

  joinCompany(companyId: number): void {
    this.loading = companyId;
    
    this.groupService.joinCompany(this.groupId, companyId).subscribe({
      next: (group) => {
        this.loading = null;
        this.toastService.showSuccess('Successfully joined company!', 'Success');
        this.router.navigate(['/groups']);
      },
      error: (error) => {
        this.loading = null;
        console.error('Error joining company:', error);
        this.toastService.showError('Failed to join company', 'Error');
      }
    });
  }

  skipJoin(): void {
    this.router.navigate(['/groups']);
  }
}