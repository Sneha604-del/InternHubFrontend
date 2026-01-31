import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Group, InternshipType, InternshipMode } from '../../models/group.model';

@Component({
  selector: 'app-group-create',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, 
    InputNumberModule
  ],
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit {
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
  internshipTypeOptions: any[] = [];
  internshipModeOptions: any[] = [];
  durationOptions = [
    {label: '1 Month', value: '1'},
    {label: '2 Months', value: '2'},
    {label: '3 Months', value: '3'},
    {label: '6 Months', value: '6'}
  ];
  academicYearOptions = [
    {label: '2nd Year', value: '2nd Year'},
    {label: '3rd Year', value: '3rd Year'},
    {label: 'Final Year', value: 'Final Year'}
  ];
  loading = false;

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.internshipTypeOptions = this.internshipTypes.map(t => ({label: t.replace('_', ' '), value: t}));
    this.internshipModeOptions = this.internshipModes.map(m => ({label: m, value: m}));
  }

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
        // Navigate to groups page
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