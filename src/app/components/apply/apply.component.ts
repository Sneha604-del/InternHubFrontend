import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1>Educational Information</h1>
      
      <form (ngSubmit)="onSubmit()" #applyForm="ngForm">
        <div class="form-group">
          <label>Name of your college/university *</label>
          <input type="text" [(ngModel)]="applicationData.college" name="college" required>
        </div>

        <div class="form-group">
          <label>Degree/program you are studying *</label>
          <input type="text" [(ngModel)]="applicationData.degree" name="degree" required>
        </div>

        <div class="form-group">
          <label>Year of study *</label>
          <select [(ngModel)]="applicationData.yearOfStudy" name="yearOfStudy" required>
            <option value="">Select year</option>
            <option value="1st year">1st year</option>
            <option value="2nd year">2nd year</option>
            <option value="3rd year">3rd year</option>
            <option value="4th year">4th year</option>
            <option value="5th year">5th year</option>
          </select>
        </div>

        <h2>Documents for Verification</h2>

        <div class="form-group">
          <label>Student ID card *</label>
          <input type="file" (change)="onFileSelect($event, 'studentId')" 
                 accept=".pdf,.jpg,.jpeg,.png" required>
          <small>Upload PDF, JPG, or PNG (Max 5MB)</small>
        </div>

        <div class="form-group">
          <label>Resume/CV *</label>
          <input type="file" (change)="onFileSelect($event, 'resume')" 
                 accept=".pdf" required>
          <small>Upload PDF only (Max 5MB)</small>
        </div>

        <button type="submit" class="btn" [disabled]="!applyForm.form.valid || loading">
          {{ loading ? 'Submitting...' : 'Submit Application' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .page { padding: 16px; max-width: 600px; margin: 0 auto; background: #f5f5f5; min-height: 100vh; }
    h1 { font-size: 20px; font-weight: 600; color: #222; margin: 16px 0 20px; text-align: center; }
    h2 { font-size: 16px; font-weight: 600; color: #222; margin: 24px 0 12px; }
    form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 18px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #333; }
    .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #2196F3; }
    .form-group small { display: block; margin-top: 4px; font-size: 12px; color: #666; }
    .btn { width: 100%; background: #2196F3; color: white; border: none; padding: 12px; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 10px; }
    .btn:hover:not(:disabled) { background: #1976D2; }
    .btn:disabled { background: #ccc; cursor: not-allowed; }
    .error-message { color: #dc3545; margin: 12px 0; font-size: 14px; }
    .success-message { color: #28a745; margin: 12px 0; font-size: 14px; }
  `]
})
export class ApplyComponent implements OnInit {
  internshipId: number = 0;
  currentYear = new Date().getFullYear();
  loading = false;

  applicationData = {
    college: '',
    degree: '',
    yearOfStudy: '',
    studentId: null as File | null,
    resume: null as File | null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.internshipId = +params['internshipId'];
    });
  }

  onFileSelect(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.showError('File size must be less than 5MB', 'File Error');
        event.target.value = '';
        return;
      }
      (this.applicationData as any)[field] = file;
    }
  }

  onSubmit() {
    this.loading = true;

    const formData = new FormData();
    formData.append('internshipId', this.internshipId.toString());
    formData.append('college', this.applicationData.college);
    formData.append('degree', this.applicationData.degree);
    formData.append('yearOfStudy', this.applicationData.yearOfStudy);
    
    if (this.applicationData.studentId) {
      formData.append('studentId', this.applicationData.studentId);
    }
    if (this.applicationData.resume) {
      formData.append('resume', this.applicationData.resume);
    }

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

    this.http.post(`${environment.apiUrl}/api/applications`, formData, { headers }).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Application submitted successfully!', 'Success');
        setTimeout(() => this.router.navigate(['/home']), 2000);
      },
      error: (error) => {
        this.loading = false;
        this.toastService.showError(error.error?.message || 'Failed to submit application', 'Application Error');
      }
    });
  }
}
