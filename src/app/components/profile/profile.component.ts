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
        <mat-spinner diameter="50"></mat-spinner>
        <p>Loading profile...</p>
      </div>

      <div *ngIf="!loading && profile" class="content">
        <div *ngIf="!editMode" class="profile-section">
          <div class="profile-header">
            <div class="profile-avatar">
              <mat-icon>person</mat-icon>
            </div>
            <h2>{{ profile.fullName }}</h2>
            <p>Student</p>
          </div>

          <mat-list class="menu-list">
            <mat-list-item (click)="enableEdit()">
              <mat-icon matListItemIcon>edit</mat-icon>
              <span matListItemTitle>Edit Profile</span>
            </mat-list-item>
            <mat-list-item (click)="openFavorites()">
              <mat-icon matListItemIcon>favorite</mat-icon>
              <span matListItemTitle>Favorites</span>
            </mat-list-item>
            <mat-list-item (click)="openNotifications()">
              <mat-icon matListItemIcon>notifications</mat-icon>
              <span matListItemTitle>Notifications</span>
            </mat-list-item>
            <mat-list-item (click)="openSettings()">
              <mat-icon matListItemIcon>settings</mat-icon>
              <span matListItemTitle>Settings</span>
            </mat-list-item>
            <mat-list-item (click)="changePassword()">
              <mat-icon matListItemIcon>lock</mat-icon>
              <span matListItemTitle>Change Password</span>
            </mat-list-item>
            <mat-list-item (click)="openHelpSupport()">
              <mat-icon matListItemIcon>help</mat-icon>
              <span matListItemTitle>Help & Support</span>
            </mat-list-item>
            <mat-list-item (click)="openReviewRating()">
              <mat-icon matListItemIcon>star</mat-icon>
              <span matListItemTitle>Review & Rating</span>
            </mat-list-item>
          </mat-list>

          <button mat-raised-button color="warn" (click)="confirmDelete()" class="signout-btn">
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
              <button mat-button type="button" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <div *ngIf="showDeleteConfirm" class="modal-overlay" (click)="showDeleteConfirm = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Sign Out</h2>
          <p>Are you sure you want to sign out?</p>
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
              <mat-icon matSuffix>lock</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New Password</mat-label>
              <input matInput type="password" [(ngModel)]="passwordData.newPassword" name="newPassword" required minlength="6">
              <mat-icon matSuffix>lock_open</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm New Password</mat-label>
              <input matInput type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required>
              <mat-icon matSuffix>lock_open</mat-icon>
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
    .profile-container { max-width: 600px; margin: 0 auto; padding: 20px; min-height: 100vh; background: #f5f5f5; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; gap: 16px; }
    .profile-section, .edit-section { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .profile-header { text-align: center; margin-bottom: 24px; }
    .profile-avatar { background: #1976d2; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .profile-header h2 { margin: 0 0 8px 0; font-size: 24px; font-weight: 500; }
    .profile-header p { margin: 0; color: #666; }
    .menu-list { padding: 0; margin-bottom: 24px; }
    .signout-btn { width: 100%; }
    .edit-section h2 { margin: 0 0 24px 0; font-size: 24px; font-weight: 500; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .form-actions { display: flex; gap: 12px; margin-top: 20px; }
    .form-actions button { flex: 1; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; padding: 24px; border-radius: 8px; max-width: 400px; width: 90%; margin: 20px; }
    .modal-content h2 { margin: 0 0 16px 0; font-size: 20px; font-weight: 500; }
    .modal-actions { display: flex; gap: 12px; margin-top: 20px; }
    .modal-actions button { flex: 1; }
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
    return this.profile?.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  }

  enableEdit() {
    if (this.profile) {
      this.editData = {
        fullName: this.profile.fullName,
        college: this.profile.college,
        course: this.profile.course
      };
      this.editMode = true;
    }
  }

  cancelEdit() {
    this.editMode = false;
  }

  updateProfile() {
    if (!this.profile) return;
    this.saving = true;
    this.profileService.updateProfile(this.profile.id, this.editData).subscribe({
      next: (data) => {
        this.profile = data;
        this.editMode = false;
        this.saving = false;
        this.toastService.showSuccess('Profile updated successfully!', 'Success');
      },
      error: (error) => {
        this.saving = false;
        this.toastService.showError('Failed to update profile', 'Error');
      }
    });
  }

  changePassword() {
    this.passwordData = { currentPassword: '', newPassword: '' };
    this.confirmPassword = '';
    this.showPasswordModal = true;
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
