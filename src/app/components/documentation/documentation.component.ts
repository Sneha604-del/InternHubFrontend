import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="doc-container" 
         (touchstart)="onTouchStart($event)" 
         (touchend)="onTouchEnd($event)"
         (mousedown)="onMouseDown($event)"
         (mousemove)="onMouseMove($event)"
         (mouseup)="onMouseUp($event)"
         (wheel)="onWheel($event)">

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'documents'"
          (click)="switchTab('documents')">
          <mat-icon>description</mat-icon>
          <span>Applications</span>
        </button>
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'certificate'"
          (click)="switchTab('certificate')">
          <mat-icon>workspace_premium</mat-icon>
          <span>Certificates</span>
        </button>
      </div>

      <!-- Swipe Indicator -->
      <div class="swipe-indicator">
        <div class="swipe-dots">
          <div class="dot" [class.active]="activeTab === 'documents'"></div>
          <div class="dot" [class.active]="activeTab === 'certificate'"></div>
        </div>
      </div>

      <!-- Content Wrapper with Slide Animation -->
      <div class="slider-wrapper">
        <div class="content-slider" [style.transform]="'translateX(' + getSlideOffset() + '%)'">
          <!-- Documents Tab -->
          <div class="content-section slide">
            <div *ngIf="loading && activeTab === 'documents'" class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p class="loading-text">Loading applications...</p>
            </div>
            
            <div *ngIf="!loading && applications.length === 0" class="empty-state">
              <mat-icon class="empty-icon">description</mat-icon>
              <h3>No Applications Found</h3>
              <p>You haven't submitted any internship applications yet.</p>
            </div>
            
            <div *ngIf="!loading && applications.length > 0" class="items-grid">
              <div *ngFor="let app of applications" class="item-card">
                <div (click)="toggleApplicationDetail(app.id)" style="cursor: pointer;">
                  <div class="card-header">
                    <div class="card-title-section">
                      <mat-icon class="card-icon">work</mat-icon>
                      <div>
                        <h3 class="card-title">{{app.internshipTitle}}</h3>
                        <p class="card-company">{{app.companyName}}</p>
                      </div>
                    </div>
                    <span class="status-badge" [class]="'status-' + app.status.toLowerCase()">{{app.status}}</span>
                  </div>
                  
                  <div class="card-details">
                    <div class="detail-item">
                      <mat-icon class="detail-icon">calendar_today</mat-icon>
                      <span>Applied: {{app.appliedDate | date:'mediumDate'}}</span>
                    </div>
                    <div class="detail-item">
                      <mat-icon class="detail-icon">school</mat-icon>
                      <span>{{app.degree}} ({{app.yearOfStudy}})</span>
                    </div>
                  </div>
                </div>
                
                <div class="card-actions">
                  <a *ngIf="app.resumeUrl" [href]="getFileUrl(app.resumeUrl)" target="_blank" class="action-btn primary">
                    <mat-icon>description</mat-icon>
                    <span>Resume</span>
                  </a>
                  <a *ngIf="app.studentIdUrl" [href]="getFileUrl(app.studentIdUrl)" target="_blank" class="action-btn secondary">
                    <mat-icon>badge</mat-icon>
                    <span>Student ID</span>
                  </a>
                </div>

                <div *ngIf="expandedApplicationId === app.id" class="expanded-details">
                  <div class="progress-bar-container">
                    <div class="progress-bar" [style.width]="getProgressPercentage(app.status) + '%'"></div>
                  </div>
                  <p class="progress-text">{{getProgressText(app.status)}}</p>
                  
                  <div class="detail-section">
                    <h4>Application Details</h4>
                    <div *ngIf="app.fullName" class="detail-item-expanded">
                      <span class="label">Name:</span>
                      <span class="value">{{app.fullName}}</span>
                    </div>
                    <div *ngIf="app.email" class="detail-item-expanded">
                      <span class="label">Email:</span>
                      <span class="value">{{app.email}}</span>
                    </div>
                    <div *ngIf="app.phone" class="detail-item-expanded">
                      <span class="label">Phone:</span>
                      <span class="value">{{app.phone}}</span>
                    </div>
                    <div *ngIf="app.college" class="detail-item-expanded">
                      <span class="label">College:</span>
                      <span class="value">{{app.college}}</span>
                    </div>
                    <div *ngIf="app.skills" class="detail-item-expanded">
                      <span class="label">Skills:</span>
                      <span class="value">{{app.skills}}</span>
                    </div>
                    <div *ngIf="app.motivation" class="detail-item-expanded">
                      <span class="label">Motivation:</span>
                      <span class="value">{{app.motivation}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Certificates Tab -->
          <div class="content-section slide">
            <div *ngIf="loading && activeTab === 'certificate'" class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p class="loading-text">Loading certificates...</p>
            </div>
            
            <div *ngIf="!loading && certificates.length === 0" class="empty-state">
              <mat-icon class="empty-icon">workspace_premium</mat-icon>
              <h3>No Certificates Available</h3>
              <p>Complete your internships to earn certificates.</p>
            </div>
            
            <div *ngIf="!loading && certificates.length > 0" class="items-grid">
              <div *ngFor="let cert of certificates" class="item-card certificate-card">
                <div class="card-header">
                  <div class="card-title-section">
                    <mat-icon class="card-icon certificate-icon">workspace_premium</mat-icon>
                    <div>
                      <h3 class="card-title">{{cert.internshipTitle}}</h3>
                      <p class="card-company">{{cert.companyName}}</p>
                    </div>
                  </div>
                  <span class="cert-number">{{cert.certificateNumber}}</span>
                </div>
                
                <div class="card-actions">
                  <a [href]="getCertificateUrl(cert.fileName)" target="_blank" class="action-btn primary view-cert-btn">
                    <mat-icon>picture_as_pdf</mat-icon>
                    View Certificate
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  `,
  styles: [`
    .doc-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
      background: #fafafa;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      overflow-x: hidden;
    }
    
    .tab-navigation {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
      overflow: hidden;
      margin-bottom: 16px;
      display: flex;
    }
    
    .nav-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px 20px;
      background: white;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #616161;
      transition: all 0.2s;
      border-right: 1px solid #f5f5f5;
    }
    
    .nav-tab:last-child {
      border-right: none;
    }
    
    .nav-tab:hover {
      background-color: #f8f9fa;
      color: #1976d2;
    }
    
    .nav-tab.active {
      background: #1976d2;
      color: white;
    }
    
    .nav-tab mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .swipe-indicator {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .swipe-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #e0e0e0;
      transition: all 0.3s;
    }
    
    .dot.active {
      background: #1976d2;
      transform: scale(1.2);
    }
    
    .swipe-hint {
      margin: 0;
      font-size: 12px;
      color: #757575;
      font-style: italic;
    }
    
    .slider-wrapper {
      overflow: hidden;
      width: 100%;
    }
    
    .content-slider {
      display: flex;
      width: 200%;
      transition: transform 0.3s ease-in-out;
    }
    
    .content-section {
      width: 50%;
      padding: 0;
      min-height: 400px;
      flex-shrink: 0;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      gap: 16px;
    }
    
    .loading-text {
      color: #666;
      font-size: 14px;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      text-align: center;
      color: #757575;
    }
    
    .empty-icon {
      font-size: 48px !important;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #bdbdbd;
    }
    
    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 500;
      color: #616161;
    }
    
    .empty-state p {
      margin: 0;
      font-size: 14px;
      color: #757575;
    }
    
    .items-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .item-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-left: 4px solid #ff9800;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s;
    }
    
    .item-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    .certificate-card {
      border-left: 4px solid #ff9800;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .card-title-section {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
    }
    
    .card-icon {
      color: #1976d2;
      font-size: 24px !important;
      width: 24px;
      height: 24px;
      margin-top: 2px;
    }
    
    .certificate-icon {
      color: #ff9800 !important;
    }
    
    .card-title {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: #212121;
      line-height: 1.3;
    }
    
    .card-company {
      margin: 0;
      font-size: 14px;
      color: #757575;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-pending {
      background: #fff3cd;
      color: #856404;
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
    
    .cert-number {
      background: #e9ecef;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      color: #495057;
      font-weight: 600;
    }
    
    .card-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #616161;
    }
    
    .detail-icon {
      font-size: 16px !important;
      width: 16px;
      height: 16px;
      color: #757575;
    }
    
    .card-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
      border: 1px solid transparent;
    }
    
    .action-btn.primary {
      background: #1976d2;
      color: white;
    }
    
    .action-btn.primary:hover {
      background: #1565c0;
      transform: translateY(-1px);
    }
    
    .action-btn.secondary {
      background: #f5f5f5;
      color: #616161;
      border-color: #e0e0e0;
    }
    
    .action-btn.secondary:hover {
      background: #eeeeee;
      color: #424242;
    }
    
    .action-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .view-cert-btn {
      width: 100%;
      height: 40px;
      font-weight: 500;
      justify-content: center;
    }

    .expanded-details {
      padding: 16px 0;
      border-top: 1px solid #f0f0f0;
      margin-top: 12px;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 500px;
      }
    }

    .progress-bar-container {
      width: 100%;
      height: 6px;
      background: #e0e0e0;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 12px;
      color: #666;
      margin-bottom: 12px;
      font-weight: 500;
    }

    .detail-section {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
    }

    .detail-section h4 {
      margin: 0 0 8px 0;
      font-size: 13px;
      font-weight: 600;
      color: #333;
    }

    .detail-item-expanded {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 12px;
    }

    .detail-item-expanded .label {
      font-weight: 600;
      color: #666;
    }

    .detail-item-expanded .value {
      color: #333;
      text-align: right;
      flex: 1;
      margin-left: 8px;
      word-break: break-word;
    }
    

    
    @media (max-width: 768px) {
      .doc-container {
        padding: 16px;
      }
      
      .nav-tab {
        padding: 12px 16px;
        font-size: 13px;
      }
      
      .content-section {
        padding: 0;
      }
      
      .item-card {
        padding: 16px;
      }
      
      .card-title-section {
        gap: 10px;
      }
      
      .card-title {
        font-size: 15px;
      }
      
      .card-company {
        font-size: 13px;
      }
      
      .status-badge {
        font-size: 11px;
        padding: 3px 10px;
      }
      
      .cert-number {
        font-size: 11px;
        padding: 3px 10px;
      }
      
      .detail-item {
        font-size: 13px;
      }
      
      .action-btn {
        padding: 6px 12px;
        font-size: 12px;
      }
      

    }
  `]
})
export class DocumentationComponent implements OnInit {
  activeTab: 'documents' | 'certificate' = 'documents';
  applications: any[] = [];
  certificates: any[] = [];
  loading = false;
  expandedApplicationId: number | null = null;
  private touchStartX = 0;
  private touchEndX = 0;
  private mouseStartX = 0;
  private mouseEndX = 0;
  private isDragging = false;

  constructor(private documentService: DocumentService, private router: Router) {}

  toggleApplicationDetail(applicationId: number) {
    this.expandedApplicationId = this.expandedApplicationId === applicationId ? null : applicationId;
  }

  getProgressPercentage(status: string): number {
    const stages: Record<string, number> = {
      'pending': 20,
      'reviewed': 40,
      'shortlisted': 60,
      'interview': 80,
      'accepted': 100,
      'rejected': 0,
      'completed': 100
    };
    return stages[status.toLowerCase()] || 0;
  }

  getProgressText(status: string): string {
    const texts: Record<string, string> = {
      'pending': '20% - Application Submitted',
      'reviewed': '40% - Under Review',
      'shortlisted': '60% - Shortlisted',
      'interview': '80% - Interview Stage',
      'accepted': '100% - Accepted',
      'rejected': 'Application Rejected',
      'completed': '100% - Internship Completed'
    };
    return texts[status.toLowerCase()] || 'Pending';
  }

  viewApplicationDetail(applicationId: number) {
    this.router.navigate(['/application-detail'], { queryParams: { id: applicationId } });
  }

  ngOnInit() {
    this.loadApplications();
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  onMouseDown(event: MouseEvent) {
    this.mouseStartX = event.clientX;
    this.isDragging = true;
    document.body.style.userSelect = 'none';
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
  }

  onMouseUp(event: MouseEvent) {
    if (!this.isDragging) return;
    this.mouseEndX = event.clientX;
    this.isDragging = false;
    document.body.style.userSelect = '';
    this.handleMouseSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 30;
    const swipeDistance = this.touchStartX - this.touchEndX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && this.activeTab === 'documents') {
        this.switchTab('certificate');
      } else if (swipeDistance < 0 && this.activeTab === 'certificate') {
        this.switchTab('documents');
      }
    }
  }

  handleMouseSwipe() {
    const swipeThreshold = 30;
    const swipeDistance = this.mouseStartX - this.mouseEndX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && this.activeTab === 'documents') {
        this.switchTab('certificate');
      } else if (swipeDistance < 0 && this.activeTab === 'certificate') {
        this.switchTab('documents');
      }
    }
  }

  onWheel(event: WheelEvent) {
    const threshold = 10;
    if (Math.abs(event.deltaX) > threshold) {
      event.preventDefault();
      if (event.deltaX > 0 && this.activeTab === 'documents') {
        this.switchTab('certificate');
      } else if (event.deltaX < 0 && this.activeTab === 'certificate') {
        this.switchTab('documents');
      }
    }
  }

  getSlideOffset(): number {
    return this.activeTab === 'documents' ? 0 : -50;
  }

  switchTab(tab: 'documents' | 'certificate') {
    this.activeTab = tab;
    if (tab === 'documents' && this.applications.length === 0) {
      this.loadApplications();
    } else if (tab === 'certificate' && this.certificates.length === 0) {
      this.loadCertificates();
    }
  }

  loadApplications() {
    this.loading = true;
    this.documentService.getApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading applications:', err);
        this.loading = false;
      }
    });
  }

  loadCertificates() {
    this.loading = true;
    this.documentService.getCertificates().subscribe({
      next: (data) => {
        this.certificates = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading certificates:', err);
        this.loading = false;
      }
    });
  }

  getCertificateUrl(fileName: string): string {
    return this.documentService.getCertificateUrl(fileName);
  }

  getFileUrl(filePath: string): string {
    return this.documentService.getFileUrl(filePath);
  }
}
