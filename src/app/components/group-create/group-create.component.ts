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
  phoneError = '';
  submitted = false;

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

  validatePhone(): void {
    const phone = this.group.facultyPhone;
    if (!phone) {
      this.phoneError = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      this.phoneError = 'Phone number must be exactly 10 digits';
    } else {
      this.phoneError = '';
    }
  }

  isFormValid(): boolean {
    const isValid = !!(this.group.groupName && this.group.collegeName && this.group.department &&
      this.group.academicYear && this.group.semester && this.group.totalStudents &&
      this.group.internshipType && this.group.preferredMode && this.group.durationMonths &&
      this.group.startDate && this.group.endDate && this.group.facultyName &&
      this.group.facultyEmail && this.group.facultyPhone && !this.phoneError);
    console.log('Form valid:', isValid, 'Submitted:', this.submitted);
    return isValid;
  }

  onSubmit(): void {
    this.submitted = true;
    console.log('Submit clicked, submitted flag:', this.submitted);
    console.log('Group data:', this.group);
    
    // Check form validity first
    if (!this.isFormValid()) {
      console.log('Form is invalid, finding first empty field');
      // Find first empty field and scroll to it
      let firstEmptyFieldId = '';
      if (!this.group.groupName) firstEmptyFieldId = 'groupName';
      else if (!this.group.collegeName) firstEmptyFieldId = 'collegeName';
      else if (!this.group.department) firstEmptyFieldId = 'department';
      else if (!this.group.academicYear) firstEmptyFieldId = 'academicYear';
      else if (!this.group.semester) firstEmptyFieldId = 'semester';
      else if (!this.group.totalStudents) firstEmptyFieldId = 'totalStudents';
      else if (!this.group.internshipType) firstEmptyFieldId = 'internshipType';
      else if (!this.group.preferredMode) firstEmptyFieldId = 'preferredMode';
      else if (!this.group.durationMonths) firstEmptyFieldId = 'durationMonths';
      else if (!this.group.startDate) firstEmptyFieldId = 'startDate';
      else if (!this.group.endDate) firstEmptyFieldId = 'endDate';
      else if (!this.group.facultyName) firstEmptyFieldId = 'facultyName';
      else if (!this.group.facultyEmail) firstEmptyFieldId = 'facultyEmail';
      else if (!this.group.facultyPhone) firstEmptyFieldId = 'facultyPhone';
      
      console.log('First empty field:', firstEmptyFieldId);
      
      if (firstEmptyFieldId) {
        setTimeout(() => {
          const element = document.getElementById(firstEmptyFieldId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }, 100);
      }
      return;
    }
    
    console.log('Form is valid, proceeding with submission');
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