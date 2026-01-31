import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../services/attendance.service';
import { GroupService } from '../../services/group.service';
import { AttendanceResponse } from '../../models/attendance.model';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ]
})
export class AdminDashboardComponent implements OnInit {
  attendanceData: AttendanceResponse[] = [];
  groups: Group[] = [];
  selectedGroupId: number | null = null;
  startDate: string = '';
  endDate: string = '';
  isLoading = false;

  displayedColumns: string[] = ['studentName', 'attendanceDate', 'checkInTime', 'status', 'location'];

  constructor(
    private attendanceService: AttendanceService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.setTodayDate();
    this.loadGroups();
  }

  setTodayDate() {
    const today = new Date();
    this.startDate = today.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  loadGroups() {
    this.groupService.getAllGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        if (groups.length > 0) {
          this.selectedGroupId = groups[0].id!;
          this.loadAttendance();
        }
      },
      error: (error) => {
        console.error('Error loading groups:', error);
      }
    });
  }

  loadAttendance() {
    this.isLoading = true;
    
    if (this.selectedGroupId && this.startDate && this.endDate) {
      this.attendanceService.getGroupAttendanceByDateRange(
        this.selectedGroupId, 
        this.startDate, 
        this.endDate
      ).subscribe({
        next: (data) => {
          this.attendanceData = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading attendance:', error);
          this.isLoading = false;
        }
      });
    } else if (this.selectedGroupId) {
      this.attendanceService.getGroupAttendance(this.selectedGroupId).subscribe({
        next: (data) => {
          this.attendanceData = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading attendance:', error);
          this.isLoading = false;
        }
      });
    } else {
      // Load all attendance if no group selected
      this.attendanceService.getAllAttendance().subscribe({
        next: (data) => {
          this.attendanceData = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading attendance:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onGroupChange() {
    this.loadAttendance();
  }

  onDateChange() {
    this.loadAttendance();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PRESENT': return 'success';
      case 'LOCATION_MISMATCH': return 'warning';
      case 'ABSENT': return 'danger';
      default: return 'medium';
    }
  }

  exportAttendance() {
    // Implementation for exporting attendance data
    console.log('Exporting attendance data...');
  }

  viewLocation(attendance: AttendanceResponse) {
    // Implementation for viewing location on map
    if (attendance.latitude && attendance.longitude) {
      const url = `https://www.google.com/maps?q=${attendance.latitude},${attendance.longitude}`;
      window.open(url, '_blank');
    }
  }
}