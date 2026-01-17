import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, DropdownModule, ButtonModule, CardModule, FileUploadModule],
  template: `
    <div class="apply-container">
      <div class="apply-header">
        <i class="pi pi-graduation-cap"></i>
        <h1>Educational Information</h1>
      </div>

      <form (ngSubmit)="onSubmit()" #applyForm="ngForm" class="apply-form">
        <div class="field">
          <label for="college">Name of your college *</label>
          <input pInputText id="college" [(ngModel)]="applicationData.college" name="college" required class="w-full" />
        </div>

        <div class="field">
          <label for="degree">Degree you are studying *</label>
          <input pInputText id="degree" [(ngModel)]="applicationData.degree" name="degree" required class="w-full" />
        </div>

        <div class="field">
          <label for="yearOfStudy">Year of study *</label>
          <p-dropdown id="yearOfStudy" [(ngModel)]="applicationData.yearOfStudy" name="yearOfStudy" 
                      [options]="yearOptions" optionLabel="label" optionValue="value" 
                      placeholder="Select year" [required]="true" styleClass="w-full"></p-dropdown>
        </div>

        <div class="documents-section">
          <h2>
            <i class="pi pi-paperclip"></i>
            Documents for Verification
          </h2>

          <div class="field">
            <label>Student ID card *</label>
            <input #studentIdInput type="file" (change)="onFileSelect($event, 'studentId')" 
                   accept=".pdf,.jpg,.jpeg,.png" required style="display: none;">
            <p-button (onClick)="studentIdInput.click()" [label]="studentIdFileName || 'Choose File'" 
                      icon="pi pi-upload" styleClass="w-full p-button-outlined"></p-button>
            <small class="file-hint">Upload PDF, JPG, or PNG (Max 5MB)</small>
          </div>

          <div class="field">
            <label>Resume/CV *</label>
            <input #resumeInput type="file" (change)="onFileSelect($event, 'resume')" 
                   accept=".pdf" required style="display: none;">
            <p-button (onClick)="resumeInput.click()" [label]="resumeFileName || 'Choose File'" 
                      icon="pi pi-upload" styleClass="w-full p-button-outlined"></p-button>
            <small class="file-hint">Upload PDF only (Max 5MB)</small>
          </div>
        </div>

        <p-button type="submit" [label]="loading ? 'Submitting...' : 'Submit Application'" 
                  [disabled]="!isFormValid() || loading" [loading]="loading" 
                  icon="pi pi-check" styleClass="w-full submit-btn"></p-button>
      </form>
    </div>
  `,
  styles: [`
    .apply-container { max-width: 700px; margin: 0 auto; padding: 24px; min-height: 100vh; }
    .apply-header { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
    .apply-header i { font-size: 32px; color: #667eea; }
    .apply-header h1 { margin: 0; font-size: 28px; font-weight: 600; color: #333; }
    .apply-form { }
    .field { margin-bottom: 24px; }
    .field label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 14px; }
    .w-full { width: 100%; }
    .submit-btn { height: 48px; font-size: 16px; font-weight: 600; margin-top: 24px; }
    .documents-section { margin: 32px 0; padding-top: 24px; border-top: 2px solid #e0e0e0; }
    .documents-section h2 { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 600; color: #333; margin-bottom: 24px; }
    .documents-section h2 i { font-size: 24px; color: #667eea; }
    .file-hint { display: block; margin-top: 8px; font-size: 12px; color: #666; }
  `]
})
export class ApplyComponent implements OnInit {
  internshipId: number = 0;
  companyId: number = 0;
  companyName: string = '';
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

  yearOptions = [
    { label: '1st year', value: '1st year' },
    { label: '2nd year', value: '2nd year' },
    { label: '3rd year', value: '3rd year' },
    { label: '4th year', value: '4th year' },
    { label: '5th year', value: '5th year' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.internshipId = +params['internshipId'];
      this.companyId = +params['companyId'];
      this.companyName = params['companyName'] || '';
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
        setTimeout(() => {
          this.router.navigate(['/internships'], {
            queryParams: { companyId: this.companyId, companyName: this.companyName }
          });
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.toastService.showError(error.error?.message || 'Failed to submit application', 'Application Error');
      }
    });
  }
}
