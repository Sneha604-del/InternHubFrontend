import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProfileService, PasswordChangeRequest } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule, DialogModule, ButtonModule, InputTextModule],
  template: `
    <div class="security-container">
      <div class="security-section">
        <h1 class="page-title">Security Settings</h1>
        
        <div class="menu-section">
          <div class="menu-item" (click)="changePassword()">
            <mat-icon class="menu-icon">lock_outline</mat-icon>
            <div class="menu-content">
              <span class="menu-title">Change Password</span>
              <span class="menu-subtitle">Update your account password</span>
            </div>
            <mat-icon class="chevron">chevron_right</mat-icon>
          </div>
          
          <div class="menu-item" (click)="twoFactorAuth()">
            <mat-icon class="menu-icon">security</mat-icon>
            <div class="menu-content">
              <span class="menu-title">Two-Factor Authentication</span>
              <span class="menu-subtitle">Add extra security to your account</span>
            </div>
            <mat-icon class="chevron">chevron_right</mat-icon>
          </div>
          
          <div class="menu-item" (click)="loginActivity()">
            <mat-icon class="menu-icon">history</mat-icon>
            <div class="menu-content">
              <span class="menu-title">Login Activity</span>
              <span class="menu-subtitle">View recent login sessions</span>
            </div>
            <mat-icon class="chevron">chevron_right</mat-icon>
          </div>
        </div>
      </div>

      <!-- 2FA Modal -->
      <p-dialog [(visible)]="show2FAModal" [modal]="true" [closable]="true"
                [style]="{width: '90vw', maxWidth: '500px'}" header="Two-Factor Authentication">
        <div *ngIf="!twoFactorEnabled && !qrCodeUrl" class="setup-2fa">
          <p style="margin-bottom: 1.5rem; color: #666;">Secure your account with two-factor authentication</p>
          <p-button label="Setup 2FA" icon="pi pi-shield" (onClick)="setup2FA()" styleClass="w-full"></p-button>
        </div>
        
        <div *ngIf="qrCodeUrl" class="qr-setup">
          <p style="margin-bottom: 1rem; color: #666;">Scan this QR code with your authenticator app:</p>
          <img [src]="qrCodeUrl" alt="QR Code" class="qr-code">
          <div class="secret-key">Secret Key: {{ secretKey }}</div>
          
          <div class="backup-codes" *ngIf="backupCodes.length > 0">
            <h4 style="margin-bottom: 0.75rem; font-size: 14px; font-weight: 600;">Backup Codes (Save these safely):</h4>
            <div class="codes-grid">
              <span *ngFor="let code of backupCodes" class="backup-code">{{ code }}</span>
            </div>
          </div>
          
          <div class="field">
            <label for="verificationCode">Enter verification code</label>
            <input pInputText id="verificationCode" [(ngModel)]="verificationCode" 
                   placeholder="000000" class="w-full" />
          </div>
        </div>
        
        <div *ngIf="twoFactorEnabled && !qrCodeUrl" class="manage-2fa">
          <p style="margin-bottom: 1.5rem; color: #666;">Two-factor authentication is enabled</p>
        </div>
        
        <ng-template pTemplate="footer">
          <div style="display: flex; gap: 0.75rem; width: 100%;">
            <p-button *ngIf="qrCodeUrl" label="Cancel" icon="pi pi-times" (onClick)="cancel2FASetup()" 
                      [style]="{flex: '1'}" styleClass="p-button-secondary"></p-button>
            <p-button *ngIf="qrCodeUrl" label="Verify & Enable" icon="pi pi-check" (onClick)="verify2FA()" 
                      [style]="{flex: '1'}"></p-button>
            <p-button *ngIf="twoFactorEnabled && !qrCodeUrl" label="Disable 2FA" icon="pi pi-ban" 
                      (onClick)="disable2FA()" [style]="{flex: '1'}" styleClass="p-button-danger"></p-button>
            <p-button *ngIf="twoFactorEnabled && !qrCodeUrl" label="Close" icon="pi pi-times" 
                      (onClick)="show2FAModal = false" [style]="{flex: '1'}" styleClass="p-button-secondary"></p-button>
          </div>
        </ng-template>
      </p-dialog>

      <!-- Login Activity Modal -->
      <p-dialog [(visible)]="showLoginActivityModal" [modal]="true" [closable]="true"
                [style]="{width: '90vw', maxWidth: '600px'}" header="Login Activity">
        <div class="activity-list">
          <div *ngIf="loginActivities.length === 0" class="no-activity">
            <i class="pi pi-history" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
            <p style="margin: 0 0 0.5rem 0; font-size: 16px; font-weight: 500;">No login activity found</p>
            <small style="font-size: 13px; color: #999;">Login activity will appear here after you log in</small>
          </div>
          
          <div *ngFor="let activity of loginActivities" class="activity-item">
            <div class="activity-info">
              <div class="activity-header">
                <span class="device">{{ activity.deviceInfo || 'Unknown Device' }}</span>
                <span class="status" [class.active]="activity.isActive">{{ activity.isActive ? 'Active' : 'Ended' }}</span>
              </div>
              <div class="activity-details">
                <span>{{ activity.ipAddress }}</span> • 
                <span>{{ activity.location || 'Unknown Location' }}</span>
              </div>
              <div class="activity-time">
                {{ formatDate(activity.loginTime) }}
                <span *ngIf="activity.logoutTime"> - {{ formatDate(activity.logoutTime) }}</span>
              </div>
            </div>
            <p-button *ngIf="activity.isActive" label="End Session" icon="pi pi-sign-out" 
                      (onClick)="terminateSession(activity.id)" styleClass="p-button-danger p-button-sm"></p-button>
          </div>
        </div>
        
        <ng-template pTemplate="footer">
          <p-button label="Close" icon="pi pi-times" (onClick)="showLoginActivityModal = false" 
                    styleClass="p-button-secondary"></p-button>
        </ng-template>
      </p-dialog>

      <p-dialog [(visible)]="showPasswordModal" [modal]="true" [closable]="true"
                [style]="{width: '90vw', maxWidth: '400px'}" header="Change Password">
        <form (ngSubmit)="submitPasswordChange()" #passwordForm="ngForm">
          <div class="field">
            <label for="currentPassword">Current Password</label>
            <input pInputText id="currentPassword" type="password" [(ngModel)]="passwordData.currentPassword" 
                   name="currentPassword" required class="w-full" />
          </div>

          <div class="field">
            <label for="newPassword">New Password</label>
            <input pInputText id="newPassword" type="password" [(ngModel)]="passwordData.newPassword" 
                   name="newPassword" required minlength="6" class="w-full" />
          </div>

          <div class="field">
            <label for="confirmPassword">Confirm New Password</label>
            <input pInputText id="confirmPassword" type="password" [(ngModel)]="confirmPassword" 
                   name="confirmPassword" required class="w-full" />
          </div>
        </form>
        
        <ng-template pTemplate="footer">
          <div style="display: flex; gap: 0.75rem; width: 100%;">
            <p-button label="Cancel" icon="pi pi-times" (onClick)="cancelPasswordChange()" 
                      [style]="{flex: '1'}" styleClass="p-button-secondary" type="button"></p-button>
            <p-button label="Change Password" icon="pi pi-check" (onClick)="submitPasswordChange()" 
                      [disabled]="changingPassword || !passwordForm.valid" [loading]="changingPassword"
                      [style]="{flex: '1'}" type="button"></p-button>
          </div>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .security-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
      background: #fafafa;
    }
    
    .security-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .page-title {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
      color: #212121;
      text-align: center;
    }
    
    .menu-section {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
      overflow: hidden;
    }
    
    .menu-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid #f5f5f5;
    }
    
    .menu-item:last-child {
      border-bottom: none;
    }
    
    .menu-item:hover {
      background-color: #f8f9fa;
    }
    
    .menu-icon {
      color: #616161;
      margin-right: 16px;
      font-size: 20px !important;
    }
    
    .menu-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .menu-title {
      font-size: 16px;
      font-weight: 500;
      color: #212121;
      margin-bottom: 2px;
    }
    
    .menu-subtitle {
      font-size: 13px;
      color: #757575;
    }
    
    .chevron {
      color: #bdbdbd;
      font-size: 18px !important;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
    }
    
    .modal-content {
      background: white;
      padding: 24px;
      border-radius: 12px;
      max-width: 400px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
    
    .large-modal {
      max-width: 600px;
    }
    
    .qr-code {
      width: 200px;
      height: 200px;
      margin: 16px auto;
      display: block;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 8px;
      background: white;
    }
    
    .secret-key {
      font-family: monospace;
      background: #f0f3ff;
      padding: 12px;
      border-radius: 8px;
      text-align: center;
      margin: 16px 0;
      font-size: 13px;
      color: #333;
      border: 1px solid #d0d7ff;
    }
    
    .backup-codes {
      margin: 20px 0;
      padding: 16px;
      background: #fff9e6;
      border-radius: 8px;
      border: 1px solid #ffe0a3;
    }
    
    .codes-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 12px;
    }
    
    .backup-code {
      font-family: monospace;
      background: white;
      padding: 8px 12px;
      border-radius: 6px;
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      color: #333;
      border: 1px solid #e0e0e0;
    }
    
    .activity-list {
      max-height: 450px;
      overflow-y: auto;
      margin: -0.5rem 0;
    }
    
    .activity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      gap: 12px;
    }
    
    .activity-item:last-child {
      border-bottom: none;
    }
    
    .activity-info {
      flex: 1;
    }
    
    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    
    .device {
      font-weight: 500;
      color: #212121;
    }
    
    .status {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 12px;
      background: #f5f5f5;
      color: #666;
    }
    
    .status.active {
      background: #e8f5e8;
      color: #2e7d32;
    }
    
    .activity-details {
      font-size: 13px;
      color: #666;
      margin-bottom: 2px;
    }
    
    .activity-time {
      font-size: 12px;
      color: #999;
    }
    
    .no-activity {
      text-align: center;
      padding: 48px 20px;
      color: #666;
    }
    
    .setup-2fa,
    .manage-2fa {
      text-align: center;
      padding: 8px 0;
    }
    
    .qr-setup {
      padding: 8px 0;
    }
    
    .field { 
      margin-bottom: 1.25rem; 
    }
    
    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }
    
    .w-full {
      width: 100%;
    }
    
    .modal-content h2 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: #212121;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .modal-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }
    
    .modal-actions button {
      flex: 1;
      height: 40px;
    }
    
    @media (max-width: 768px) {
      .security-container {
        padding: 16px;
      }
      
      .menu-item {
        padding: 14px 16px;
      }
      
      .modal-content {
        padding: 20px;
        margin: 16px;
      }
    }
    
    /* PrimeNG Button Enhancements */
    ::ng-deep .p-button {
      padding: 0.75rem 1.5rem !important;
      font-size: 15px !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      transition: all 0.2s !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }
    
    ::ng-deep .p-button:hover:not(:disabled) {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
    }
    
    ::ng-deep .p-button-secondary {
      background: #6c757d !important;
      border-color: #6c757d !important;
      color: white !important;
    }
    
    ::ng-deep .p-button-secondary:hover:not(:disabled) {
      background: #5a6268 !important;
      border-color: #545b62 !important;
    }
    
    ::ng-deep .p-button-danger {
      background: #dc3545 !important;
      border-color: #dc3545 !important;
    }
    
    ::ng-deep .p-button-danger:hover:not(:disabled) {
      background: #c82333 !important;
      border-color: #bd2130 !important;
    }
    
    ::ng-deep .p-button-sm {
      padding: 0.5rem 1rem !important;
      font-size: 13px !important;
    }
    
    ::ng-deep .p-dialog .p-dialog-footer {
      padding: 1.25rem !important;
      background: #f8f9fa !important;
      border-top: 1px solid #dee2e6 !important;
    }
    
    /* Enhanced Dialog Styling */
    ::ng-deep .p-dialog {
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25) !important;
      border-radius: 12px !important;
      overflow: hidden !important;
    }
    
    ::ng-deep .p-dialog .p-dialog-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      padding: 1.5rem !important;
      border-bottom: none !important;
    }
    
    ::ng-deep .p-dialog .p-dialog-header .p-dialog-title {
      color: white !important;
      font-weight: 600 !important;
      font-size: 18px !important;
    }
    
    ::ng-deep .p-dialog .p-dialog-header .p-dialog-header-icon {
      color: white !important;
    }
    
    ::ng-deep .p-dialog .p-dialog-content {
      background: white !important;
      padding: 1.5rem !important;
    }
    
    ::ng-deep .p-dialog-mask {
      background: rgba(0, 0, 0, 0.6) !important;
      backdrop-filter: blur(4px) !important;
    }
  `]
})
export class SecurityComponent implements OnInit {
  showPasswordModal = false;
  show2FAModal = false;
  showLoginActivityModal = false;
  changingPassword = false;
  passwordData: PasswordChangeRequest = { currentPassword: '', newPassword: '' };
  confirmPassword = '';
  
  // 2FA properties
  twoFactorEnabled = false;
  qrCodeUrl = '';
  secretKey = '';
  backupCodes: string[] = [];
  verificationCode = '';
  
  // Login Activity properties
  loginActivities: any[] = [];

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.load2FAStatus();
  }

  changePassword() {
    this.passwordData = { currentPassword: '', newPassword: '' };
    this.confirmPassword = '';
    this.showPasswordModal = true;
  }

  twoFactorAuth() {
    console.log('2FA method called');
    this.load2FAStatus();
    this.show2FAModal = true;
    console.log('2FA modal should be open:', this.show2FAModal);
  }

  loginActivity() {
    console.log('Login activity method called');
    this.loadLoginActivity();
    this.showLoginActivityModal = true;
    console.log('Login activity modal should be open:', this.showLoginActivityModal);
  }

  submitPasswordChange() {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;
    
    if (this.passwordData.newPassword !== this.confirmPassword) {
      this.toastService.showError('New passwords do not match', 'Validation Error');
      return;
    }
    if (this.passwordData.newPassword.length < 6) {
      this.toastService.showError('Password must be at least 6 characters long', 'Validation Error');
      return;
    }

    this.changingPassword = true;
    this.profileService.changePassword(user.id, this.passwordData).subscribe({
      next: () => {
        this.toastService.showSuccess('Password changed successfully! Please login again.', 'Success');
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.toastService.showError(error.error || 'Failed to change password', 'Password Change Error');
        this.changingPassword = false;
      }
    });
  }

  cancelPasswordChange() {
    this.showPasswordModal = false;
    this.passwordData = { currentPassword: '', newPassword: '' };
    this.confirmPassword = '';
  }

  // 2FA Methods
  load2FAStatus() {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      console.log('No user found');
      return;
    }
    
    console.log('Loading 2FA status for user:', user.id);
    this.http.get(`${environment.apiUrl}/api/security/2fa/status/${user.id}`).subscribe({
      next: (response: any) => {
        console.log('2FA Status response:', response);
        this.twoFactorEnabled = response.enabled;
      },
      error: (error) => {
        console.error('Error loading 2FA status:', error);
        this.toastService.showError('Failed to load 2FA status', 'Error');
      }
    });
  }

  setup2FA() {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;
    
    console.log('Setting up 2FA for user:', user.id);
    this.http.post(`${environment.apiUrl}/api/security/2fa/setup/${user.id}`, {}).subscribe({
      next: (response: any) => {
        console.log('2FA Setup response:', response);
        this.qrCodeUrl = response.qrCodeUrl;
        this.secretKey = response.secretKey;
        this.backupCodes = response.backupCodes;
      },
      error: (error) => {
        console.error('Error setting up 2FA:', error);
        this.toastService.showError('Failed to setup 2FA', 'Error');
      }
    });
  }

  verify2FA() {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;
    
    this.http.put(`${environment.apiUrl}/api/security/2fa/toggle/${user.id}`, { enabled: true }).subscribe({
      next: () => {
        this.twoFactorEnabled = true;
        this.qrCodeUrl = '';
        this.toastService.showSuccess('2FA enabled successfully!', 'Success');
      },
      error: (error) => {
        this.toastService.showError('Failed to enable 2FA', 'Error');
      }
    });
  }

  disable2FA() {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;
    
    this.http.put(`${environment.apiUrl}/api/security/2fa/toggle/${user.id}`, { enabled: false }).subscribe({
      next: () => {
        this.twoFactorEnabled = false;
        this.show2FAModal = false;
        this.toastService.showSuccess('2FA disabled successfully!', 'Success');
      },
      error: (error) => {
        this.toastService.showError('Failed to disable 2FA', 'Error');
      }
    });
  }

  cancel2FASetup() {
    this.show2FAModal = false;
    this.qrCodeUrl = '';
    this.secretKey = '';
    this.backupCodes = [];
    this.verificationCode = '';
  }

  // Login Activity Methods
  loadLoginActivity() {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      console.log('No user found for login activity');
      return;
    }
    
    console.log('Loading login activity for user:', user.id);
    this.http.get(`${environment.apiUrl}/api/security/login-activity/${user.id}`).subscribe({
      next: (response: any) => {
        console.log('Login activity response:', response);
        this.loginActivities = response;
      },
      error: (error) => {
        console.error('Error loading login activity:', error);
        this.toastService.showError('Failed to load login activity', 'Error');
      }
    });
  }

  terminateSession(activityId: number) {
    this.http.put(`${environment.apiUrl}/api/security/login-activity/terminate/${activityId}`, {}).subscribe({
      next: () => {
        this.loadLoginActivity();
        this.toastService.showSuccess('Session terminated successfully!', 'Success');
      },
      error: (error) => {
        this.toastService.showError('Failed to terminate session', 'Error');
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}