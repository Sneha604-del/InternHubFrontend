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

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router
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
    this.router.navigate(['/group-details', groupId]);
  }

  editGroup(groupId: number): void {
    this.router.navigate(['/group-edit', groupId]);
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
      return;
    }

    this.sendingInvite = true;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.sendingInvite = false;
      return;
    }

    const invitationData = {
      groupId: this.selectedGroupId,
      inviterId: currentUser.id,
      inviteeEmail: this.inviteEmail,
      message: this.inviteMessage
    };

    this.groupService.sendInvitation(invitationData).subscribe({
      next: (response) => {
        console.log('Invitation sent successfully:', response);
        this.sendingInvite = false;
        this.closeInviteDialog();
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error sending invitation:', error);
        this.sendingInvite = false;
      }
    });
  }

  getStatusSeverity(status: string): "warning" | "success" | "info" | "danger" | "secondary" | "contrast" | undefined {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'APPLIED': return 'info';
      case 'SELECTED': return 'warning';
      case 'PENDING': return 'warning';
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