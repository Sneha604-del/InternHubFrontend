import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="doc-container">
      <div class="tabs">
        <button 
          class="tab" 
          [class.active]="activeTab === 'documents'"
          (click)="switchTab('documents')">
          Your Documents
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'certificate'"
          (click)="switchTab('certificate')">
          Certificates
        </button>
      </div>

      <div class="tab-content">
        <div *ngIf="activeTab === 'documents'">
          <h2>Your Application Documents</h2>
          <div *ngIf="loading" class="loading">Loading...</div>
          <div *ngIf="!loading && applications.length === 0" class="empty">No applications found.</div>
          <div *ngIf="!loading && applications.length > 0" class="doc-list">
            <div *ngFor="let app of applications" class="doc-card">
              <div class="doc-header">
                <h3>{{app.internshipTitle}}</h3>
                <span class="status" [class]="'status-' + app.status.toLowerCase()">{{app.status}}</span>
              </div>
              <div class="doc-info">
                <p><strong>Company:</strong> {{app.companyName}}</p>
                <p><strong>Applied:</strong> {{app.appliedDate | date:'medium'}}</p>
                <p><strong>Degree:</strong> {{app.degree}} ({{app.yearOfStudy}})</p>
              </div>
              <div class="doc-files">
                <a *ngIf="app.resumeUrl" [href]="getFileUrl(app.resumeUrl)" target="_blank" class="file-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Resume
                </a>
                <a *ngIf="app.studentIdUrl" [href]="getFileUrl(app.studentIdUrl)" target="_blank" class="file-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="16" rx="2"/>
                    <circle cx="9" cy="10" r="2"/>
                    <path d="M15 11h3m-3 4h3"/>
                  </svg>
                  Student ID
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="activeTab === 'certificate'">
          <h2>Your Certificates</h2>
          <div *ngIf="loading" class="loading">Loading...</div>
          <div *ngIf="!loading && certificates.length === 0" class="empty">No certificates available.</div>
          <div *ngIf="!loading && certificates.length > 0" class="cert-list">
            <div *ngFor="let cert of certificates" class="cert-card">
              <div class="cert-header">
                <h3>{{cert.internshipTitle}}</h3>
                <span class="cert-number">{{cert.certificateNumber}}</span>
              </div>
              <div class="cert-info">
                <p><strong>Company:</strong> {{cert.companyName}}</p>
              </div>
              <button class="view-cert-btn" (click)="viewCertificate(cert)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                View Certificate
              </button>
            </div>
          </div>
          
          <div *ngIf="selectedCertificate" class="cert-modal" (click)="closeCertificate()">
            <div class="cert-modal-content" (click)="$event.stopPropagation()">
              <button class="close-btn" (click)="closeCertificate()">✕</button>
              <div [innerHTML]="certificateHtml" class="cert-html"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .doc-container { padding: 16px; min-height: 100vh; background: #f8f9fa; }
    .tabs { display: flex; gap: 0; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); justify-content: center; margin-bottom: 16px; overflow: hidden; }
    .tab { padding: 12px 24px; background: white; border: none; cursor: pointer; font-size: 14px; color: #666; transition: all 0.2s; }
    .tab:hover { color: #007bff; }
    .tab.active { background: #007bff; color: white; }
    .tab-content { padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); min-height: calc(100vh - 120px); }
    h2 { margin-top: 0; color: #333; font-size: 20px; }
    .loading, .empty { text-align: center; padding: 40px; color: #666; }
    .doc-list, .cert-list { display: grid; gap: 16px; }
    .doc-card, .cert-card { background: #f8f9fa; border-radius: 8px; padding: 16px; border-left: 4px solid #007bff; }
    .doc-header, .cert-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; }
    .doc-header h3, .cert-header h3 { margin: 0; font-size: 16px; color: #333; }
    .status { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-accepted { background: #d4edda; color: #155724; }
    .status-rejected { background: #f8d7da; color: #721c24; }
    .status-completed { background: #d1ecf1; color: #0c5460; }
    .cert-number { background: #e9ecef; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-family: monospace; }
    .doc-info, .cert-info { margin-bottom: 12px; }
    .doc-info p, .cert-info p { margin: 4px 0; font-size: 14px; color: #555; }
    .remarks { font-style: italic; color: #666; }
    .doc-files { display: flex; gap: 10px; }
    .file-link { display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-size: 12px; font-weight: 600; transition: all 0.2s; }
    .file-link:hover { background: #0056b3; transform: translateY(-1px); }
    .file-link svg { width: 14px; height: 14px; }
    .download-btn { display: inline-block; padding: 8px 16px; background: #28a745; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; margin-top: 8px; }
    .download-btn:hover { background: #218838; }
    .view-hint { color: #007bff; font-size: 13px; margin-top: 8px; font-style: italic; }
    .cert-card { transition: transform 0.2s, box-shadow 0.2s; }
    .view-cert-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 8px 14px; background: #28a745; color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 12px; }
    .view-cert-btn:hover { background: #218838; transform: translateY(-1px); }
    .view-cert-btn svg { width: 16px; height: 16px; }
    .cert-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .cert-modal-content { background: white; padding: 20px; border-radius: 8px; max-width: 90vw; max-height: 90vh; overflow: auto; position: relative; width: 100%; }
    .close-btn { position: absolute; top: 10px; right: 10px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; font-size: 20px; z-index: 1001; display: flex; align-items: center; justify-content: center; }
    .close-btn:hover { background: #c82333; }
    .cert-html { min-width: 600px; padding: 20px; box-sizing: border-box; }
    @media (max-width: 768px) {
      .doc-container { padding: 12px; }
      .tabs { margin-bottom: 12px; }
      .tab { padding: 10px 16px; font-size: 13px; }
      .tab-content { padding: 16px; }
      h2 { font-size: 18px; }
      .doc-list, .cert-list { gap: 12px; }
      .doc-card, .cert-card { padding: 14px; }
      .doc-header h3, .cert-header h3 { font-size: 15px; }
      .status { font-size: 11px; padding: 3px 10px; }
      .cert-number { font-size: 11px; padding: 3px 10px; }
      .doc-info p, .cert-info p { font-size: 13px; }
      .file-link { padding: 5px 8px; font-size: 11px; gap: 3px; }
      .file-link svg { width: 12px; height: 12px; }
      .view-cert-btn { padding: 6px 10px; font-size: 12px; gap: 4px; }
      .view-cert-btn svg { width: 14px; height: 14px; }
      .cert-modal { padding: 10px; }
      .cert-modal-content { max-width: 100%; max-height: 95vh; padding: 40px 10px 10px 10px; border-radius: 12px; }
      .cert-html { min-width: auto; width: 100%; padding: 10px; transform: scale(0.35); transform-origin: top left; }
      .close-btn { width: 32px; height: 32px; top: 5px; right: 5px; font-size: 18px; }
    }
  `]
})
export class DocumentationComponent implements OnInit {
  activeTab: 'documents' | 'certificate' = 'documents';
  applications: any[] = [];
  certificates: any[] = [];
  loading = false;
  selectedCertificate: any = null;
  certificateHtml: SafeHtml = '';


  constructor(
    private documentService: DocumentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadApplications();
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

  viewCertificate(cert: any) {
    this.selectedCertificate = cert;
    this.documentService.getCertificateContent(cert.fileName).subscribe({
      next: (html) => {
        this.certificateHtml = this.sanitizer.bypassSecurityTrustHtml(html);
      },
      error: (err) => {
        console.error('Error loading certificate:', err);
      }
    });
  }

  closeCertificate() {
    this.selectedCertificate = null;
    this.certificateHtml = '';
  }

  getFileUrl(filePath: string): string {
    return this.documentService.getFileUrl(filePath);
  }
}
