import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatOptionModule],
  template: `
    <div class="apply-container">
      <div class="apply-header">
        <mat-icon>school</mat-icon>
        <h1>Educational Information</h1>
      </div>

      <form (ngSubmit)="onSubmit()" #applyForm="ngForm" class="apply-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name of your college</mat-label>
          <input matInput [(ngModel)]="applicationData.college" name="college" required>
          <mat-icon matSuffix>account_balance</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Degree you are studying</mat-label>
          <input matInput [(ngModel)]="applicationData.degree" name="degree" required>
          <mat-icon matSuffix>book</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Year of study</mat-label>
          <mat-select [(ngModel)]="applicationData.yearOfStudy" name="yearOfStudy" required>
            <mat-option value="1st year">1st year</mat-option>
            <mat-option value="2nd year">2nd year</mat-option>
            <mat-option value="3rd year">3rd year</mat-option>
            <mat-option value="4th year">4th year</mat-option>
            <mat-option value="5th year">5th year</mat-option>
          </mat-select>
          <mat-icon matSuffix>calendar_today</mat-icon>
        </mat-form-field>

        <div class="documents-section">
          <h2>
            <mat-icon>attach_file</mat-icon>
            Documents for Verification
          </h2>

          <div class="file-upload">
            <label class="file-label">Student ID card *</label>
            <input #studentIdInput type="file" (change)="onFileSelect($event, 'studentId')"
                   accept=".pdf,.jpg,.jpeg,.png" required style="display: none;">
            <button mat-stroked-button (click)="studentIdInput.click()" class="file-button">
              <mat-icon>cloud_upload</mat-icon>
              {{ studentIdFileName || 'Choose File' }}
            </button>
            <small class="file-hint">Upload PDF, JPG, or PNG (Max 5MB)</small>
          </div>

          <div class="file-upload">
            <label class="file-label">Resume/CV *</label>
            <input #resumeInput type="file" (change)="onFileSelect($event, 'resume')"
                   accept=".pdf" required style="display: none;">
            <button mat-stroked-button (click)="resumeInput.click()" class="file-button">
              <mat-icon>cloud_upload</mat-icon>
              {{ resumeFileName || 'Choose File' }}
            </button>
            <small class="file-hint">Upload PDF only (Max 5MB)</small>
          </div>
        </div>

        <button mat-raised-button color="primary" type="submit"
                [disabled]="isFormValid() || loading" class="full-width submit-btn">
          <mat-icon *ngIf="loading">hourglass_empty</mat-icon>
          {{ loading ? 'Submitting...' : 'Submit Application' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .apply-container { max-width: 600px; margin: 0 auto; padding: 20px; min-height: 100vh; background: #f5f5f5; }
    .apply-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .apply-header h1 { margin: 0; font-size: 24px; font-weight: 500; color: #333; }
    .apply-form { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .full-width { width: 100%; margin-bottom: 16px; }
    .submit-btn { height: 48px; font-size: 16px; font-weight: 500; margin-top: 20px; }
    .documents-section { margin: 24px 0; }
    .documents-section h2 { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 500; color: #333; margin-bottom: 16px; }
    .file-upload { margin: 16px 0; }
    .file-label { display: block; margin-bottom: 8px; font-weight: 500; color: #333; }
    .file-button { width: 100%; justify-content: flex-start; padding: 12px; margin-bottom: 8px; }
    .file-hint { display: block; margin-top: 4px; font-size: 12px; color: #666; }
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

  studentIdFileName = '';
  resumeFileName = '';

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
      if (field === 'studentId') {
        this.studentIdFileName = file.name;
      } else if (field === 'resume') {
        this.resumeFileName = file.name;
      }
    }
  }

  isFormValid(): boolean {
    return this.applicationData.college.trim() !== '' &&
           this.applicationData.degree.trim() !== '' &&
           this.applicationData.yearOfStudy !== '' &&
           this.applicationData.studentId !== null &&
           this.applicationData.resume !== null;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.toastService.showError('Please fill all fields and upload required documents', 'Validation Error');
      return;
    }

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
