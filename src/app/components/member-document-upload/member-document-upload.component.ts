import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-member-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './member-document-upload.component.html',
  styleUrls: ['./member-document-upload.component.css']
})
export class MemberDocumentUploadComponent implements OnInit {
  applicationId: number = 0;
  groupId: number = 0;
  loading = false;
  uploading = false;
  documentStatus: any = null;
  hasApplication = false;

  studentIdFile: File | null = null;
  resumeFile: File | null = null;
  studentIdFileName = '';
  resumeFileName = '';

  fileErrors = {
    studentId: '',
    resume: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check for applicationId from query params (from notification)
    this.route.queryParams.subscribe(params => {
      if (params['applicationId']) {
        this.applicationId = +params['applicationId'];
        this.hasApplication = true;
        this.loadDocumentStatus();
      }
    });

    // Check for groupId from route params (from Groups tab)
    this.route.params.subscribe(params => {
      if (params['groupId']) {
        this.groupId = +params['groupId'];
        this.checkGroupApplication();
      }
    });
  }

  checkGroupApplication() {
    // Check if group has an application
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    this.http.get(`${environment.apiUrl}/api/applications/group/${this.groupId}`, { headers })
      .subscribe({
        next: (application: any) => {
          if (application && application.id) {
            this.applicationId = application.id;
            this.hasApplication = true;
            this.loadDocumentStatus();
          } else {
            this.hasApplication = false;
            this.toastService.showInfo('Group leader has not submitted an application yet', 'No Application');
          }
        },
        error: (error) => {
          this.hasApplication = false;
          if (error.status === 404) {
            this.toastService.showInfo('Group leader has not submitted an application yet', 'No Application');
          }
        }
      });
  }

  loadDocumentStatus() {
    this.loading = true;
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    this.http.get(`${environment.apiUrl}/api/group-member-documents/my-status/${this.applicationId}`, { headers })
      .subscribe({
        next: (status: any) => {
          this.documentStatus = status;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading status:', error);
          this.loading = false;
        }
      });
  }

  onFileSelect(event: any, field: string) {
    const file = event.target.files[0];
    this.fileErrors[field as keyof typeof this.fileErrors] = '';
    
    if (file) {
      if (file.size > 256 * 1024) {
        this.fileErrors[field as keyof typeof this.fileErrors] = 'File size too large. Max 256KB';
        event.target.value = '';
        return;
      }

      if (field === 'studentId') {
        this.studentIdFile = file;
        this.studentIdFileName = file.name;
      } else if (field === 'resume') {
        this.resumeFile = file;
        this.resumeFileName = file.name;
      }
    }
  }

  canSubmit(): boolean {
    return !!(this.studentIdFile && this.resumeFile);
  }

  onSubmit() {
    if (!this.canSubmit()) {
      this.toastService.showError('Please select both documents', 'Missing Files');
      return;
    }

    this.uploading = true;
    const formData = new FormData();
    formData.append('applicationId', this.applicationId.toString());
    formData.append('studentId', this.studentIdFile!);
    formData.append('resume', this.resumeFile!);

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    this.http.post(`${environment.apiUrl}/api/group-member-documents/upload`, formData, { headers })
      .subscribe({
        next: (response: any) => {
          this.uploading = false;
          this.toastService.showSuccess('Documents uploaded successfully!', 'Success');
          this.loadDocumentStatus();
        },
        error: (error) => {
          this.uploading = false;
          console.error('Upload error:', error);
          this.toastService.showError('Failed to upload documents', 'Error');
        }
      });
  }
}
