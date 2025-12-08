import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService, Profile, ProfileUpdateRequest, PasswordChangeRequest } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div *ngIf="loading" class="loading">Loading...</div>

      <div *ngIf="!loading && profile" class="content">

        
        <div class="profile-card" *ngIf="!editMode">
          <div class="profile-header">
            <div class="avatar-wrapper">
              <div class="avatar">
                <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            <h2 class="user-name">{{ profile.fullName }}</h2>
            <p class="user-role">Student</p>
          </div>

          <div class="menu-list">
            <button class="menu-item" (click)="enableEdit()">
              <span class="menu-text">Edit Profile</span>
              <span class="menu-arrow">›</span>
            </button>
            <button class="menu-item" (click)="openSettings()">
              <span class="menu-text">Settings</span>
              <span class="menu-arrow">›</span>
            </button>
            <button class="menu-item" (click)="changePassword()">
              <span class="menu-text">Change Password</span>
              <span class="menu-arrow">›</span>
            </button>
          </div>

          <button class="signout-btn" (click)="confirmDelete()">
            <span class="signout-icon"></span>
            Sign Out
          </button>
        </div>

        <div class="edit-card" *ngIf="editMode">
          <h2 class="edit-title">Edit Profile</h2>
          <form (ngSubmit)="updateProfile()">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" [(ngModel)]="editData.fullName" name="fullName" required>
            </div>
            <div class="form-group">
              <label>College</label>
              <input type="text" [(ngModel)]="editData.college" name="college" required>
            </div>
            <div class="form-group">
              <label>Course</label>
              <input type="text" [(ngModel)]="editData.course" name="course" required>
            </div>
            <button type="submit" class="save-btn" [disabled]="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
            <button type="button" class="cancel-link" (click)="cancelEdit()">Cancel</button>
          </form>
        </div>
      </div>

      <div *ngIf="showDeleteConfirm" class="modal" (click)="showDeleteConfirm = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <h2>Sign Out</h2>
          <p>Are you sure you want to sign out?</p>
          <div class="modal-actions">
            <button class="modal-btn cancel" (click)="showDeleteConfirm = false">Cancel</button>
            <button class="modal-btn confirm" (click)="deleteProfile()">Sign Out</button>
          </div>
        </div>
      </div>
      
      <div *ngIf="showPasswordModal" class="modal" (click)="showPasswordModal = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <h2>Change Password</h2>
          <form (ngSubmit)="submitPasswordChange()" #passwordForm="ngForm">
            <div class="form-group">
              <label>Current Password</label>
              <input type="password" [(ngModel)]="passwordData.currentPassword" name="currentPassword" required>
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" [(ngModel)]="passwordData.newPassword" name="newPassword" required minlength="6">
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required>
            </div>
            <div class="modal-actions">
              <button type="button" class="modal-btn cancel" (click)="cancelPasswordChange()">Cancel</button>
              <button type="submit" class="modal-btn confirm" [disabled]="changingPassword || !passwordForm.valid">{{ changingPassword ? 'Changing...' : 'Change Password' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 420px; margin: 0 auto; padding: 16px; background: linear-gradient(to bottom, #f8f9fa, #ffffff); min-height: 100vh; }
    .loading { text-align: center; padding: 60px 20px; color: #999; }
    .content { animation: fadeIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    
    .page-title { font-size: 22px; font-weight: 700; color: #2c3e50; margin: 0 0 20px 0; text-align: center; }
    
    .profile-card { background: #fff; border-radius: 16px; padding: 20px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05); }
    .profile-header { text-align: center; margin-bottom: 24px; }
    .avatar-wrapper { position: relative; display: inline-block; margin-bottom: 14px; }
    .avatar { width: 80px; height: 80px; border-radius: 50%; background: #007bff; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: 700; border: 3px solid #e3f2fd; box-shadow: 0 4px 12px rgba(0,123,255,0.25); }
    .user-name { font-size: 18px; font-weight: 700; color: #2c3e50; margin: 0 0 4px 0; }
    .user-role { font-size: 13px; color: #95a5a6; margin: 0; }
    
    .menu-list { margin-bottom: 20px; }
    .menu-item { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 10px; border: none; background: none; cursor: pointer; border-bottom: 1px solid #ecf0f1; transition: all 0.2s; border-radius: 8px; }
    .menu-item:active { background: #f0f7ff; }
    .menu-text { flex: 1; text-align: left; font-size: 14px; font-weight: 500; color: #2c3e50; }
    .menu-arrow { font-size: 22px; color: #bdc3c7; }
    
    .signout-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #007bff, #0056b3); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,123,255,0.25); }
    .signout-btn:active { transform: translateY(1px); box-shadow: 0 2px 6px rgba(0,123,255,0.25); }
    .signout-icon { width: 18px; height: 18px; }
    
    .edit-card { background: #fff; border-radius: 16px; padding: 20px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.05); }
    .edit-title { font-size: 19px; font-weight: 700; color: #2c3e50; margin: 0 0 20px 0; }
    .form-group { margin-bottom: 18px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: #34495e; margin-bottom: 7px; }
    .form-group input { width: 100%; padding: 11px 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; box-sizing: border-box; background: #f8f9fa; }
    .form-group input:focus { outline: none; border-color: #007bff; background: #fff; }
    .save-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #007bff, #0056b3); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 8px; box-shadow: 0 4px 10px rgba(0,123,255,0.25); transition: all 0.2s; }
    .save-btn:active:not(:disabled) { transform: translateY(1px); box-shadow: 0 2px 6px rgba(0,123,255,0.25); }
    .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .cancel-link { width: 100%; padding: 11px; background: none; border: none; color: #7f8c8d; font-size: 14px; cursor: pointer; margin-top: 6px; }
    
    .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
    .modal-box { background: white; border-radius: 14px; padding: 24px; max-width: 340px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
    .modal-box h2 { font-size: 19px; font-weight: 700; color: #2c3e50; margin: 0 0 8px 0; }
    .modal-box p { font-size: 14px; color: #7f8c8d; margin: 0 0 18px 0; line-height: 1.4; }
    .modal-actions { display: flex; gap: 10px; }
    .modal-btn { flex: 1; padding: 11px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .modal-btn.cancel { background: #ecf0f1; color: #34495e; }
    .modal-btn.confirm { background: linear-gradient(135deg, #007bff, #0056b3); color: white; box-shadow: 0 2px 8px rgba(0,123,255,0.25); }
    .modal-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    
    @media (min-width: 768px) {
      .container { padding: 24px; }
      .page-title { font-size: 24px; margin-bottom: 24px; }
      .profile-card { padding: 32px 24px; border-radius: 20px; }
      .avatar { width: 100px; height: 100px; font-size: 36px; }
      .user-name { font-size: 22px; }
      .user-role { font-size: 14px; }
      .menu-item { padding: 18px 12px; }
      .menu-item:hover { background: #f8f9fa; }
      .menu-text { font-size: 16px; }
      .menu-arrow { font-size: 24px; }
      .signout-btn { padding: 14px; font-size: 16px; border-radius: 12px; }
      .signout-btn:hover { background: #0056b3; }
      .edit-card { padding: 28px 24px; border-radius: 20px; }
      .edit-title { font-size: 20px; margin-bottom: 24px; }
      .form-group { margin-bottom: 20px; }
      .form-group label { font-size: 14px; margin-bottom: 8px; }
      .form-group input { padding: 12px 16px; border-radius: 10px; }
      .save-btn { padding: 14px; font-size: 16px; border-radius: 12px; }
      .save-btn:hover:not(:disabled) { background: #0056b3; }
      .modal-box { padding: 28px; max-width: 360px; border-radius: 16px; }
      .modal-box h2 { font-size: 20px; }
      .modal-box p { margin-bottom: 20px; }
      .modal-actions { gap: 12px; }
      .modal-btn { padding: 12px; font-size: 15px; border-radius: 10px; }
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
    private router: Router
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
      },
      error: () => this.saving = false
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
      alert('New passwords do not match');
      return;
    }
    if (this.passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    this.changingPassword = true;
    this.profileService.changePassword(this.profile.id, this.passwordData).subscribe({
      next: () => {
        alert('Password changed successfully! Please login again.');
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert(error.error || 'Failed to change password');
        this.changingPassword = false;
      }
    });
  }
  
  cancelPasswordChange() {
    this.showPasswordModal = false;
    this.passwordData = { currentPassword: '', newPassword: '' };
    this.confirmPassword = '';
  }

  openSettings() {
    alert('Settings feature - Coming soon!');
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
