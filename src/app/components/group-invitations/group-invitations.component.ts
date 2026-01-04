import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { GroupInvitation, GroupMember, Availability } from '../../models/group.model';

@Component({
  selector: 'app-group-invitations',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatIconModule
  ],
  templateUrl: './group-invitations.component.html',
  styleUrls: ['./group-invitations.component.css']
})
export class GroupInvitationsComponent implements OnInit {
  invitations: GroupInvitation[] = [];
  loading = true;
  
  // Form data for joining group
  memberData: GroupMember = {
    studentName: '',
    githubLink: '',
    status: 'PENDING' as any
  };
  
  studentName = '';
  githubUsername = '';
  
  availabilityOptions = Object.values(Availability);
  joiningGroupId: number | null = null;

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadInvitations();
  }

  loadInvitations(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.email) {
      this.groupService.getInvitations(currentUser.email).subscribe({
        next: (invitations) => {
          this.invitations = invitations.filter(inv => inv.status === 'PENDING');
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading invitations:', error);
          this.loading = false;
        }
      });
    }
  }

  startJoining(invitation: GroupInvitation): void {
    this.joiningGroupId = invitation.group?.id || null;
  }

  cancelJoining(): void {
    this.joiningGroupId = null;
    this.resetForm();
  }

  joinGroup(invitation: GroupInvitation): void {
    if (!invitation.invitationToken) return;
    
    // Set minimal required data
    this.memberData.studentName = this.studentName;
    this.memberData.githubLink = this.githubUsername ? `https://github.com/${this.githubUsername}` : '';
    
    this.groupService.acceptInvitation(invitation.invitationToken, this.memberData).subscribe({
      next: (member) => {
        this.toastService.showSuccess('Successfully joined the group!', 'Success');
        this.loadInvitations(); // Refresh invitations
        this.cancelJoining();
      },
      error: (error) => {
        this.toastService.showError('Failed to join group', 'Error');
      }
    });
  }

  private resetForm(): void {
    this.studentName = '';
    this.githubUsername = '';
    this.memberData = {
      studentName: '',
      githubLink: '',
      status: 'PENDING' as any
    };
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACCEPTED': return 'primary';
      case 'REJECTED': return 'warn';
      case 'EXPIRED': return 'warn';
      default: return '';
    }
  }
}