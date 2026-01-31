import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GroupService } from '../../services/group.service';
import { ToastService } from '../../services/toast.service';
import { Group, InternshipType, InternshipMode } from '../../models/group.model';

@Component({
  selector: 'app-group-edit',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, 
    InputNumberModule, ProgressSpinnerModule
  ],
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {
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

  groupId: number = 0;
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
  loadingData = true;

  constructor(
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.internshipTypeOptions = this.internshipTypes.map(t => ({label: t.replace('_', ' '), value: t}));
    this.internshipModeOptions = this.internshipModes.map(m => ({label: m, value: m}));
    this.loadGroup();
  }

  loadGroup(): void {
    this.groupService.getGroupById(this.groupId).subscribe({
      next: (group) => {
        this.group = group;
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error loading group:', error);
        this.toastService.showError('Failed to load group', 'Error');
        this.loadingData = false;
        this.router.navigate(['/groups']);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.groupService.updateGroup(this.groupId, this.group).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Group updated successfully!', 'Success');
        this.router.navigate(['/groups']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Group update error:', error);
        this.toastService.showError('Failed to update group', 'Error');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/groups']);
  }
}
