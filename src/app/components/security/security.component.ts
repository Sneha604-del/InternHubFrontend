import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfileService, PasswordChangeRequest } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule],
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
      <div *ngIf="show2FAModal" class="modal-overlay" (click)="show2FAModal = false">
        <div class="modal-content large-modal" (click)="$event.stopPropagation()">
          <h2>Two-Factor Authentication</h2>
          
          <div *ngIf="!twoFactorEnabled && !qrCodeUrl" class="setup-2fa">
            <p>Secure your account with two-factor authentication</p>
            <button mat-raised-button color="primary" (click)="setup2FA()">Setup 2FA</button>
          </div>
          
          <div *ngIf="qrCodeUrl" class="qr-setup">
            <p>Scan this QR code with your authenticator app:</p>
            <img [src]="qrCodeUrl" alt="QR Code" class="qr-code">
            <p class="secret-key">Secret Key: {{ secretKey }}</p>
            
            <div class="backup-codes" *ngIf="backupCodes.length > 0">
              <h4>Backup Codes (Save these safely):</h4>
              <div class="codes-grid">
                <span *ngFor="let code of backupCodes" class="backup-code">{{ code }}</span>
              </div>
            </div>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Enter verification code</mat-label>
              <input matInput [(ngModel)]="verificationCode" placeholder="000000">
            </mat-form-field>
            
            <div class="modal-actions">
              <button mat-button (click)="cancel2FASetup()">Cancel</button>
              <button mat-raised-button color="primary" (click)="verify2FA()">Verify & Enable</button>
            </div>
          </div>
          
          <div *ngIf="twoFactorEnabled && !qrCodeUrl" class="manage-2fa">
            <p>Two-factor authentication is enabled</p>
            <div class="modal-actions">
              <button mat-raised-button color="warn" (click)="disable2FA()">Disable 2FA</button>
              <button mat-button (click)="show2FAModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Login Activity Modal -->
      <div *ngIf="showLoginActivityModal" class="modal-overlay" (click)="showLoginActivityModal = false">
        <div class="modal-content large-modal" (click)="$event.stopPropagation()">
          <h2>Login Activity</h2>
          
          <div class="activity-list">
            <div *ngIf="loginActivities.length === 0" class="no-activity">
              <mat-icon>history</mat-icon>
              <p>No login activity found</p>
              <small>Login activity will appear here after you log in</small>
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
              <button *ngIf="activity.isActive" mat-button color="warn" (click)="terminateSession(activity.id)">End Session</button>
            </div>
          </div>
          
          <div class="modal-actions">
            <button mat-button (click)="showLoginActivityModal = false">Close</button>
          </div>
        </div>
      </div>

      <div *ngIf="showPasswordModal" class="modal-overlay" (click)="showPasswordModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Change Password</h2>
          <form (ngSubmit)="submitPasswordChange()" #passwordForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Current Password</mat-label>
              <input matInput type="password" [(ngModel)]="passwordData.currentPassword" name="currentPassword" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New Password</mat-label>
              <input matInput type="password" [(ngModel)]="passwordData.newPassword" name="newPassword" required minlength="6">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm New Password</mat-label>
              <input matInput type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required>
            </mat-form-field>

            <div class="modal-actions">
              <button mat-button type="button" (click)="cancelPasswordChange()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="changingPassword || !passwordForm.valid">
                <mat-icon *ngIf="changingPassword">hourglass_empty</mat-icon>
                {{ changingPassword ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
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
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      padding: 24px;
      border-radius: 8px;
      max-width: 400px;
      width: 90%;
      margin: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .large-modal {
      max-width: 600px;
    }
    
    .qr-code {
      width: 200px;
      height: 200px;
      margin: 16px auto;
      display: block;
    }
    
    .secret-key {
      font-family: monospace;
      background: #f5f5f5;
      padding: 8px;
      border-radius: 4px;
      text-align: center;
    }
    
    .backup-codes {
      margin: 16px 0;
    }
    
    .codes-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 8px;
    }
    
    .backup-code {
      font-family: monospace;
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 4px;
      text-align: center;
      font-size: 12px;
    }
    
    .activity-list {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .activity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
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
      padding: 40px 20px;
      color: #666;
    }
    
    .no-activity mat-icon {
      font-size: 48px !important;
      color: #ccc;
      margin-bottom: 16px;
    }
    
    .no-activity p {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 500;
    }
    
    .no-activity small {
      font-size: 13px;
      color: #999;
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