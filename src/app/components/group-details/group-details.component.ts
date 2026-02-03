import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GroupService } from '../../services/group.service';
import { ToastService } from '../../services/toast.service';
import { Group, GroupMember } from '../../models/group.model';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, 
    InputTextModule, TagModule, ProgressSpinnerModule
  ],
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
  group: Group | null = null;
  members: GroupMember[] = [];
  inviteEmail = '';
  loading = true;
  inviting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const groupId = this.route.snapshot.params['id'];
    if (groupId) {
      this.loadGroupDetails(+groupId);
      this.loadGroupMembers(+groupId);
    }
  }

  loadGroupDetails(groupId: number): void {
    this.groupService.getGroupById(groupId).subscribe({
      next: (group) => {
        this.group = group;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading group:', error);
        this.loading = false;
      }
    });
  }

  loadGroupMembers(groupId: number): void {
    this.groupService.getGroupMembers(groupId).subscribe({
      next: (members) => {
        this.members = members;
      },
      error: (error) => {
        console.error('Error loading members:', error);
      }
    });
  }

  inviteStudent(): void {
    if (!this.inviteEmail || !this.group?.id) return;
    
    this.inviting = true;
    this.groupService.inviteStudent(this.group.id, this.inviteEmail).subscribe({
      next: (response) => {
        this.inviting = false;
        this.toastService.showSuccess('Invitation sent successfully!', 'Success');
        this.inviteEmail = '';
      },
      error: (error) => {
        this.inviting = false;
        this.toastService.showError('Failed to send invitation', 'Error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/groups']);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'APPLIED': return 'info';
      case 'SELECTED': return 'warning';
      default: return 'secondary';
    }
  }
}