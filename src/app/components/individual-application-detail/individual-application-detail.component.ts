import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../environment';

@Component({
  selector: 'app-individual-application-detail',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './individual-application-detail.component.html',
  styleUrls: ['./individual-application-detail.component.css']
})
export class IndividualApplicationDetailComponent implements OnInit {
  application: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const applicationId = this.route.snapshot.queryParams['applicationId'];
    if (applicationId) {
      this.loadApplication(applicationId);
    }
  }

  loadApplication(applicationId: number) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

    this.http.get(`${environment.apiUrl}/api/applications/${applicationId}`, { headers }).subscribe({
      next: (data: any) => {
        this.application = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading application:', error);
        this.loading = false;
        this.router.navigate(['/home']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/home'], { queryParams: { tab: 'docs' } });
  }
}
