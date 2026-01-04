import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Group, InternshipType, InternshipMode } from '../../models/group.model';

@Component({
  selector: 'app-group-create',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, 
    MatNativeDateModule, MatIconModule, MatStepperModule, MatProgressSpinnerModule
  ],
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent {
  group: Group = {
    groupName: '',
    collegeName: '',
    department: '',
    academicYear: '',
    semester: '',
    totalStudents: 1,
    internshipType: InternshipType.TECHNICAL,
    preferredMode: InternshipMode.HYBRID,
    durationMonths: 3,
    startDate: '',
    endDate: '',
    facultyName: '',
    facultyEmail: '',
    facultyPhone: '',
    status: 'PENDING' as any
  };

  internshipTypes = Object.values(InternshipType);
  internshipModes = Object.values(InternshipMode);
  loading = false;

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onSubmit(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.id) {
      this.toastService.showError('Please login first', 'Error');
      this.loading = false;
      return;
    }

    this.groupService.createGroup(this.group, currentUser.id).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Group created successfully!', 'Success');
        this.router.navigate(['/groups']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Group creation error:', error);
        this.toastService.showError('Failed to create group', 'Error');
      }
    });
  }
}