import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="detail-container">
      <div class="header">
        <button class="back-btn" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Application Progress</h1>
      </div>

      <div *ngIf="application" class="content">
        <div class="info-card">
          <div class="info-header">
            <div class="info-title">
              <h2>{{application.internshipTitle}}</h2>
              <p class="company">{{application.companyName}}</p>
            </div>
            <span class="status-badge" [class]="'status-' + application.status.toLowerCase()">
              {{application.status}}
            </span>
          </div>
          <div class="info-details">
            <div class="detail-row">
              <span class="label">Applied Date:</span>
              <span class="value">{{application.appliedDate | date:'mediumDate'}}</span>
            </div>
            <div class="detail-row">
              <span class="label">Degree:</span>
              <span class="value">{{application.degree}} ({{application.yearOfStudy}})</span>
            </div>
            <div class="detail-row">
              <span class="label">College:</span>
              <span class="value">{{application.college}}</span>
            </div>
            <div class="detail-row" *ngIf="application.applicationType">
              <span class="label">Application Type:</span>
              <span class="value">{{application.applicationType}}</span>
            </div>
            <div class="detail-row" *ngIf="application.fullName">
              <span class="label">Full Name:</span>
              <span class="value">{{application.fullName}}</span>
            </div>
            <div class="detail-row" *ngIf="application.email">
              <span class="label">Email:</span>
              <span class="value">{{application.email}}</span>
            </div>
            <div class="detail-row" *ngIf="application.phone">
              <span class="label">Phone:</span>
              <span class="value">{{application.phone}}</span>
            </div>
            <div class="detail-row" *ngIf="application.skills">
              <span class="label">Skills:</span>
              <span class="value">{{application.skills}}</span>
            </div>
            <div class="detail-row" *ngIf="application.motivation">
              <span class="label">Motivation:</span>
              <span class="value">{{application.motivation}}</span>
            </div>
          </div>
        </div>

        <div class="progress-section">
          <h3>Application Progress</h3>
          <div class="progress-bar-container">
            <div class="progress-bar" [style.width]="getProgressPercentage() + '%'"></div>
          </div>
          <p class="progress-text">{{getProgressText()}}</p>
          <div class="progress-stages">
            <div class="stage" [class.active]="isStageActive('pending')">
              <div class="stage-dot"></div>
              <span>Submitted</span>
            </div>
            <div class="stage" [class.active]="isStageActive('reviewed')">
              <div class="stage-dot"></div>
              <span>Reviewed</span>
            </div>
            <div class="stage" [class.active]="isStageActive('shortlisted')">
              <div class="stage-dot"></div>
              <span>Shortlisted</span>
            </div>
            <div class="stage" [class.active]="isStageActive('interview')">
              <div class="stage-dot"></div>
              <span>Interview</span>
            </div>
            <div class="stage" [class.active]="isStageActive('accepted')">
              <div class="stage-dot"></div>
              <span>Accepted</span>
            </div>
          </div>
        </div>

        <div class="documents-section">
          <h3>Documents</h3>
          <div class="documents-grid">
            <a *ngIf="application.resumeUrl" [href]="getFileUrl(application.resumeUrl)" target="_blank" class="doc-card">
              <mat-icon>description</mat-icon>
              <span>Resume</span>
            </a>
            <a *ngIf="application.studentIdUrl" [href]="getFileUrl(application.studentIdUrl)" target="_blank" class="doc-card">
              <mat-icon>badge</mat-icon>
              <span>Student ID</span>
            </a>
          </div>
        </div>

        <div class="status-message" [class]="'message-' + application.status.toLowerCase()">
          <mat-icon>info</mat-icon>
          <div>
            <h4>{{getStatusMessage().title}}</h4>
            <p>{{getStatusMessage().description}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 16px;
      min-height: 100vh;
      background: #f8f9fa;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      background: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .back-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #667eea;
    }

    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .info-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .info-title h2 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .company {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .status-badge {
      padding: 6px 14px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-reviewed {
      background: #cfe2ff;
      color: #084298;
    }

    .status-shortlisted {
      background: #d1e7dd;
      color: #0f5132;
    }

    .status-interview {
      background: #fff3cd;
      color: #664d03;
    }

    .status-accepted {
      background: #d4edda;
      color: #155724;
    }

    .status-rejected {
      background: #f8d7da;
      color: #721c24;
    }

    .status-completed {
      background: #d1ecf1;
      color: #0c5460;
    }

    .info-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
      flex-wrap: wrap;
      gap: 8px;
    }

    .label {
      font-weight: 600;
      color: #666;
      font-size: 14px;
      min-width: 100px;
    }

    .value {
      color: #333;
      font-size: 14px;
      flex: 1;
      text-align: right;
      word-break: break-word;
    }

    .progress-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .progress-section h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .progress-bar-container {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    .progress-text {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: #666;
      text-align: center;
      font-weight: 500;
    }

    .progress-stages {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }

    .stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex: 1;
      opacity: 0.5;
      transition: opacity 0.3s;
    }

    .stage.active {
      opacity: 1;
    }

    .stage-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #e0e0e0;
      transition: background 0.3s;
    }

    .stage.active .stage-dot {
      background: #667eea;
    }

    .stage span {
      font-size: 11px;
      font-weight: 600;
      color: #666;
      text-align: center;
    }

    .documents-section {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .documents-section h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .documents-grid {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .doc-card {
      flex: 1;
      min-width: 120px;
      padding: 16px;
      background: #f8f9fa;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #667eea;
      transition: all 0.2s;
    }

    .doc-card:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .doc-card mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .doc-card span {
      font-size: 12px;
      font-weight: 600;
      text-align: center;
    }

    .status-message {
      background: white;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      gap: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border-left: 4px solid #667eea;
    }

    .status-message mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: #667eea;
      flex-shrink: 0;
    }

    .status-message h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .status-message p {
      margin: 0;
      font-size: 13px;
      color: #666;
    }

    .message-pending {
      border-left-color: #ff9800;
    }

    .message-pending mat-icon {
      color: #ff9800;
    }

    .message-reviewed {
      border-left-color: #0d6efd;
    }

    .message-reviewed mat-icon {
      color: #0d6efd;
    }

    .message-shortlisted {
      border-left-color: #198754;
    }

    .message-shortlisted mat-icon {
      color: #198754;
    }

    .message-interview {
      border-left-color: #ffc107;
    }

    .message-interview mat-icon {
      color: #ffc107;
    }

    .message-accepted {
      border-left-color: #4caf50;
    }

    .message-accepted mat-icon {
      color: #4caf50;
    }

    .message-rejected {
      border-left-color: #f44336;
    }

    .message-rejected mat-icon {
      color: #f44336;
    }

    .message-completed {
      border-left-color: #17a2b8;
    }

    .message-completed mat-icon {
      color: #17a2b8;
    }

    @media (max-width: 768px) {
      .detail-container {
        padding: 12px;
      }

      .header {
        padding: 12px;
        margin-bottom: 16px;
      }

      .header h1 {
        font-size: 18px;
      }

      .info-card,
      .progress-section,
      .documents-section,
      .status-message {
        padding: 16px;
      }
    }
  `]
})
export class ApplicationDetailComponent implements OnInit {
  application: any = null;
  applicationId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.applicationId = +params['id'];
      if (this.applicationId) {
        this.loadApplicationDetail();
      }
    });
  }

  loadApplicationDetail() {
    this.documentService.getApplicationDetail(this.applicationId).subscribe({
      next: (data) => {
        this.application = data;
      },
      error: (err) => {
        console.error('Error loading application:', err);
      }
    });
  }

  isStageActive(stage: string): boolean {
    if (!this.application) return false;
    const status = this.application.status.toLowerCase();
    return status === stage || (status === 'pending' && stage === 'pending');
  }

  getProgressPercentage(): number {
    if (!this.application) return 0;
    const status = this.application.status.toLowerCase();
    const stages: Record<string, number> = {
      'pending': 20,
      'reviewed': 40,
      'shortlisted': 60,
      'interview': 80,
      'accepted': 100,
      'rejected': 0,
      'completed': 100
    };
    return stages[status] || 0;
  }

  getProgressText(): string {
    if (!this.application) return '';
    const status = this.application.status.toLowerCase();
    const texts: Record<string, string> = {
      'pending': '20% - Application Submitted',
      'reviewed': '40% - Under Review',
      'shortlisted': '60% - Shortlisted',
      'interview': '80% - Interview Stage',
      'accepted': '100% - Accepted',
      'rejected': 'Application Rejected',
      'completed': '100% - Internship Completed'
    };
    return texts[status] || 'Pending';
  }

  getStatusMessage() {
    const status = this.application?.status.toLowerCase();
    const messages: Record<string, any> = {
      'pending': { title: 'Application Submitted', description: 'Your application has been received.' },
      'reviewed': { title: 'Under Review', description: 'Your application is being reviewed by the company.' },
      'shortlisted': { title: 'Shortlisted', description: 'Congratulations! You have been shortlisted.' },
      'interview': { title: 'Interview Stage', description: 'You are invited for an interview.' },
      'accepted': { title: 'Accepted', description: 'Congratulations! Your application has been accepted.' },
      'rejected': { title: 'Rejected', description: 'Unfortunately, your application was not selected.' },
      'completed': { title: 'Completed', description: 'You have successfully completed this internship.' }
    };
    return messages[status] || messages['pending'];
  }

  getFileUrl(filePath: string): string {
    return this.documentService.getFileUrl(filePath);
  }

  goBack() {
    this.router.navigate(['/documentation']);
  }
}
