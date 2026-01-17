import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileService, Profile, ProfileUpdateRequest, PasswordChangeRequest } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatListModule, MatProgressSpinnerModule],
  template: `
    <div class="profile-container">
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p class="loading-text">Loading profile...</p>
      </div>

      <div *ngIf="!loading && profile" class="content">
        <div *ngIf="!editMode" class="profile-section">
          <!-- Profile Header -->
          <div class="profile-header">
            <div class="profile-avatar">
              <span class="avatar-text">{{ getInitials() }}</span>
            </div>
            <div class="profile-info">
              <h1 class="profile-name">{{ profile.fullName }}</h1>
              <p class="profile-role">Student</p>
            </div>
          </div>

          <!-- Menu List -->
          <div class="menu-section">
            <div class="menu-item" (click)="enableEdit()">
              <mat-icon class="menu-icon">edit</mat-icon>
              <div class="menu-content">
                <span class="menu-title">Edit Profile</span>
                <span class="menu-subtitle">Update your personal information</span>
              </div>
              <mat-icon class="chevron">chevron_right</mat-icon>
            </div>
            
            <div class="menu-item" (click)="openFavorites()">
              <mat-icon class="menu-icon">bookmark_border</mat-icon>
              <div class="menu-content">
                <span class="menu-title">Saved Internships</span>
                <span class="menu-subtitle">View your bookmarked opportunities</span>
              </div>
              <mat-icon class="chevron">chevron_right</mat-icon>
            </div>
            
            <div class="menu-item" (click)="openSecurity()">
              <mat-icon class="menu-icon">lock_outline</mat-icon>
              <div class="menu-content">
                <span class="menu-title">Security</span>
                <span class="menu-subtitle">Password, 2FA and login activity</span>
              </div>
              <mat-icon class="chevron">chevron_right</mat-icon>
            </div>
            
            <div class="menu-item" (click)="openHelpSupport()">
              <mat-icon class="menu-icon">help_outline</mat-icon>
              <div class="menu-content">
                <span class="menu-title">Help & Support</span>
                <span class="menu-subtitle">Get assistance and contact support</span>
              </div>
              <mat-icon class="chevron">chevron_right</mat-icon>
            </div>
            
            <div class="menu-item" (click)="openReviewRating()">
              <mat-icon class="menu-icon">rate_review</mat-icon>
              <div class="menu-content">
                <span class="menu-title">Reviews & Feedback</span>
                <span class="menu-subtitle">Rate your internship experience</span>
              </div>
              <mat-icon class="chevron">chevron_right</mat-icon>
            </div>
          </div>

          <button mat-stroked-button class="signout-btn" (click)="confirmDelete()">
            <mat-icon>logout</mat-icon>
            Sign Out
          </button>
        </div>

        <div *ngIf="editMode" class="edit-section">
          <h2>Edit Profile</h2>
          <form (ngSubmit)="updateProfile()" #editForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput [(ngModel)]="editData.fullName" name="fullName" required>
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>College</mat-label>
              <input matInput [(ngModel)]="editData.college" name="college" required>
              <mat-icon matSuffix>school</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Course</mat-label>
              <input matInput [(ngModel)]="editData.course" name="course" required>
              <mat-icon matSuffix>book</mat-icon>
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="saving || !editForm.valid">
                <mat-icon *ngIf="saving">hourglass_empty</mat-icon>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div *ngIf="showDeleteConfirm" class="modal-overlay" (click)="showDeleteConfirm = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Confirm Sign Out</h2>
          <p class="modal-text">Are you sure you want to sign out of your account?</p>
          <div class="modal-actions">
            <button mat-button (click)="showDeleteConfirm = false">Cancel</button>
            <button mat-raised-button color="warn" (click)="deleteProfile()">Sign Out</button>
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
    .profile-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
      background: #f5f5f5;
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
    
    .profile-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .profile-header {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
      text-align: left;
    }
    
    .profile-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .avatar-text {
      color: white;
      font-size: 22px;
      font-weight: 700;
    }
    
    .profile-info {
      flex: 1;
    }
    
    .profile-name {
      margin: 0 0 4px 0;
      font-size: 20px;
      font-weight: 700;
      color: #212121;
    }
    
    .profile-role {
      margin: 0 0 4px 0;
      color: #757575;
      font-size: 13px;
      font-weight: 500;
    }
    
    .profile-details {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #616161;
      font-size: 12px;
    }
    
    .separator {
      color: #bdbdbd;
    }
    
    .menu-section {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      border: none;
      overflow: visible;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .menu-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: none;
    }
    
    .menu-item:last-child {
      border-bottom: none;
    }
    
    .menu-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    
    .menu-icon {
      color: #667eea;
      margin-right: 16px;
      font-size: 22px !important;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f3ff;
      border-radius: 10px;
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
    
    .signout-btn {
      width: 100%;
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      color: white;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border: none;
      border-radius: 12px;
      margin-top: 12px;
      box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
    }
    
    .signout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(245, 87, 108, 0.4);
    }
    
    .edit-section {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
    }
    
    .edit-section h2 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: 600;
      color: #212121;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      justify-content: center;
    }
    
    .form-actions button {
      min-width: 200px;
      height: 40px;
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
    
    .modal-content h2 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: #212121;
    }
    
    .modal-text {
      color: #616161;
      font-size: 14px;
      line-height: 1.4;
      margin: 0 0 20px 0;
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
      .profile-container {
        padding: 16px;
      }
      
      .profile-header {
        padding: 20px;
      }
      
      .profile-details {
        justify-content: center;
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
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  loading = true;
  editMode = false;
  saving = false;
  showDeleteConfirm = false;
  showPasswordModal = false;
  changingPassword = false;
  editData: ProfileUpdateRequest = { fullName: '', college: '', course: '' };
  passwordData: PasswordChangeRequest = { currentPassword: '', newPassword: '' };
  confirmPassword = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProfile();
    
    // Listen for edit mode changes from navbar
    this.profileService.editMode$.subscribe(isEditMode => {
      if (this.editMode && !isEditMode) {
        // Edit mode was turned off externally (from navbar back button)
        this.editMode = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }



  loadProfile() {
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.profileService.getProfile(user.id).subscribe({
        next: (data) => {
          this.profile = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    } else {
      this.loading = false;
    }
  }

  getInitials(): string {
    const names = this.profile?.fullName.split(' ') || [];
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0]?.[0]?.toUpperCase() || 'U';
  }

  enableEdit() {
    if (this.profile) {
      this.editData = {
        fullName: this.profile.fullName,
        college: this.profile.college,
        course: this.profile.course
      };
      this.editMode = true;
      this.profileService.setEditMode(true);
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.profileService.setEditMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateProfile() {
    if (!this.profile) return;
    this.saving = true;
    this.profileService.updateProfile(this.profile.id, this.editData).subscribe({
      next: (data) => {
        this.profile = data;
        this.editMode = false;
        this.profileService.setEditMode(false);
        this.saving = false;
        this.toastService.showSuccess('Profile updated successfully!', 'Success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        this.saving = false;
        this.toastService.showError('Failed to update profile', 'Error');
      }
    });
  }

  openSecurity() {
    this.router.navigate(['/security']);
  }

  submitPasswordChange() {
    if (!this.profile) return;
    if (this.passwordData.newPassword !== this.confirmPassword) {
      this.toastService.showError('New passwords do not match', 'Validation Error');
      return;
    }
    if (this.passwordData.newPassword.length < 6) {
      this.toastService.showError('Password must be at least 6 characters long', 'Validation Error');
      return;
    }

    this.changingPassword = true;
    this.profileService.changePassword(this.profile.id, this.passwordData).subscribe({
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

  openFavorites() {
    this.router.navigate(['/favorites']);
  }

  openNotifications() {
    this.router.navigate(['/notifications']);
  }

  openSettings() {
    this.toastService.showInfo('Settings feature - Coming soon!', 'Info');
  }

  openHelpSupport() {
    this.router.navigate(['/help-support']);
  }

  openReviewRating() {
    this.router.navigate(['/reviews']);
  }

  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  deleteProfile() {
    if (!this.profile) return;
    this.profileService.deleteProfile(this.profile.id).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: () => this.showDeleteConfirm = false
    });
  }
}
