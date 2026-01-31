import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { NotificationService } from '../../services/notification.service';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-groups-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, TagModule, BadgeModule, DialogModule],
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.css']
})
export class GroupsListComponent implements OnInit {
  groups: Group[] = [];
  loading = true;
  invitationCount = 0;
  showInviteDialog = false;
  inviteEmail = '';
  inviteMessage = '';
  sendingInvite = false;
  selectedGroupId: number | null = null;
  showSuccessMessage = false;
  showDetailsDialog = false;
  selectedGroup: Group | null = null;
  groupInvitations: any[] = [];
  groupMembers: any[] = [];

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    console.log('GroupsListComponent ngOnInit called');
    this.loadGroups();
    this.loadInvitationCount();
  }

  loadGroups(): void {
    console.log('loadGroups() called');
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user:', currentUser);
    if (currentUser && currentUser.id) {
      console.log('Loading groups for user ID:', currentUser.id);
      this.groupService.getGroupsByLeader(currentUser.id).subscribe({
        next: (groups) => {
          console.log('Received groups:', groups);
          this.groups = groups;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading groups:', error);
          console.error('Error details:', error.message, error.status);
          this.loading = false;
        }
      });
    } else {
      console.log('No current user or user ID, stopping load');
      this.loading = false;
    }
  }

  loadInvitationCount(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.email) {
      this.groupService.getInvitationCount(currentUser.email).subscribe({
        next: (count) => {
          this.invitationCount = count;
        },
        error: (error) => {
          console.error('Error loading invitation count:', error);
          this.invitationCount = 0;
        }
      });
    }
  }

  createGroup(): void {
    this.router.navigate(['/group-create']);
  }
  
  viewInvitations(): void {
    this.router.navigate(['/group-invitations']);
  }

  viewGroup(groupId: number): void {
    this.selectedGroup = this.groups.find(g => g.id === groupId) || null;
    if (this.selectedGroup) {
      this.loadGroupInvitations(groupId);
      this.loadGroupMembers(groupId);
    }
    this.showDetailsDialog = true;
  }

  loadGroupMembers(groupId: number): void {
    this.groupService.getGroupMembers(groupId).subscribe({
      next: (members) => {
        this.groupMembers = members;
      },
      error: (error) => {
        console.error('Error loading group members:', error);
        this.groupMembers = [];
      }
    });
  }

  loadGroupInvitations(groupId: number): void {
    this.groupService.getGroupInvitations(groupId).subscribe({
      next: (invitations) => {
        this.groupInvitations = invitations;
      },
      error: (error) => {
        console.error('Error loading group invitations:', error);
        this.groupInvitations = [];
      }
    });
  }

  closeDetailsDialog(): void {
    this.showDetailsDialog = false;
    this.selectedGroup = null;
  }

  editGroup(groupId: number): void {
    this.router.navigate(['/group-edit', groupId]);
  }

  selectCompany(groupId: number): void {
    this.router.navigate(['/home'], { queryParams: { groupId: groupId } });
  }

  inviteMembers(groupId: number): void {
    this.selectedGroupId = groupId;
    this.showInviteDialog = true;
    this.inviteEmail = '';
    this.inviteMessage = '';
  }

  closeInviteDialog(): void {
    this.showInviteDialog = false;
    this.selectedGroupId = null;
    this.inviteEmail = '';
    this.inviteMessage = '';
  }

  sendInvitation(): void {
    if (!this.inviteEmail || !this.selectedGroupId) {
      alert('Please enter an email address');
      return;
    }

    this.sendingInvite = true;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      alert('User not logged in or user ID missing');
      this.sendingInvite = false;
      return;
    }

    const invitationData = {
      groupId: Number(this.selectedGroupId),
      inviterId: Number(currentUser.id),
      inviteeEmail: this.inviteEmail.trim(),
      message: this.inviteMessage || 'You have been invited to join our team!'
    };

    console.log('Sending invitation with data:', invitationData);
    console.log('Data types:', {
      groupId: typeof invitationData.groupId,
      inviterId: typeof invitationData.inviterId,
      inviteeEmail: typeof invitationData.inviteeEmail,
      message: typeof invitationData.message
    });

    this.groupService.sendInvitation(invitationData).subscribe({
      next: (response) => {
        console.log('Invitation sent successfully:', response);
        this.sendingInvite = false;
        this.closeInviteDialog();
        this.toastService.showSuccess('Invitation sent successfully!', 'Success');
        
        // Refresh notification count for all users
        const currentUser = this.authService.getCurrentUser();
        if (currentUser?.id) {
          this.notificationService.loadUnreadCount(currentUser.id);
        }
      },
      error: (error) => {
        console.error('Full error object:', error);
        console.error('Error status:', error.status);
        console.error('Error body:', error.error);
        console.error('Error message:', error.message);
        
        let errorMessage = 'Failed to send invitation';
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.toastService.showError(errorMessage, 'Error');
        this.sendingInvite = false;
        this.closeInviteDialog();
      }
    });
  }

  getStatusSeverity(status: string): "warn" | "success" | "info" | "danger" | "secondary" | "contrast" | undefined {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'APPLIED': return 'info';
      case 'SELECTED': return 'warn';
      case 'PENDING': return 'warn';
      default: return 'secondary';
    }
  }
  
  getStatusIcon(status: string): string {
    switch (status) {
      case 'APPROVED': return 'pi-check-circle';
      case 'REJECTED': return 'pi-times-circle';
      case 'APPLIED': return 'pi-send';
      case 'SELECTED': return 'pi-star';
      case 'PENDING': return 'pi-clock';
      default: return 'pi-question-circle';
    }
  }
}