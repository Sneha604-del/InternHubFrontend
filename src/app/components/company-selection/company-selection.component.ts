import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CompanyService } from '../../services/company.service';
import { GroupService } from '../../services/group.service';
import { ToastService } from '../../services/toast.service';

interface Company {
  id: number;
  name: string;
  email: string;
  website?: string;
  industry?: string;
  description?: string;
  contactPerson?: string;
  contactPhone?: string;
  address?: string;
  stateName?: string;
  cityName?: string;
  latitude?: number;
  longitude?: number;
  category?: {
    id: number;
    name: string;
  };
}

@Component({
  selector: 'app-company-selection',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ProgressSpinnerModule],
  templateUrl: './company-selection.component.html',
  styleUrls: ['./company-selection.component.css']
})
export class CompanySelectionComponent implements OnInit {
  companies: Company[] = [];
  groupId: number = 0;
  loading = false;
  loadingData = true;

  constructor(
    private companyService: CompanyService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.toastService.showError('Failed to load companies', 'Error');
        this.loadingData = false;
      }
    });
  }

  selectCompany(companyId: number): void {
    this.loading = true;
    this.groupService.joinCompany(this.groupId, companyId).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Successfully joined company!', 'Success');
        this.router.navigate(['/groups']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error joining company:', error);
        this.toastService.showError('Failed to join company', 'Error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/groups']);
  }
}