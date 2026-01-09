import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { AttendanceService, Attendance } from '../../services/attendance.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, CalendarModule, TableModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  todayAttendance: Attendance | null = null;
  weeklyAttendance: Attendance[] = [];
  totalWeeklyHours = 0;
  loading = false;
  currentUser: any;

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadTodayAttendance();
      this.loadWeeklyAttendance();
    }
  }

  loadTodayAttendance() {
    this.attendanceService.getTodayAttendance(this.currentUser.id).subscribe({
      next: (attendance) => this.todayAttendance = attendance,
      error: () => this.todayAttendance = null
    });
  }

  loadWeeklyAttendance() {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    this.attendanceService.getUserAttendance(this.currentUser.id, startDate, endDate).subscribe({
      next: (attendance) => {
        this.weeklyAttendance = attendance;
        this.calculateWeeklyHours();
      }
    });
  }

  calculateWeeklyHours() {
    this.totalWeeklyHours = this.weeklyAttendance.reduce((total, att) => 
      total + (att.totalHours || 0), 0
    );
  }

  checkIn() {
    if (!this.currentUser.groupId) {
      alert('Please join a group first');
      return;
    }

    this.loading = true;
    this.attendanceService.checkIn(this.currentUser.id, this.currentUser.groupId).subscribe({
      next: (attendance) => {
        this.todayAttendance = attendance;
        this.loading = false;
      },
      error: (error) => {
        alert('Check-in failed');
        this.loading = false;
      }
    });
  }

  checkOut() {
    this.loading = true;
    this.attendanceService.checkOut(this.currentUser.id).subscribe({
      next: (attendance) => {
        this.todayAttendance = attendance;
        this.loadWeeklyAttendance();
        this.loading = false;
      },
      error: (error) => {
        alert('Check-out failed');
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
    switch (status) {
      case 'PRESENT': return 'success';
      case 'LATE': return 'warning';
      case 'HALF_DAY': return 'info';
      case 'ABSENT': return 'danger';
      default: return 'secondary';
    }
  }

  formatTime(dateTime: string | undefined): string {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getPresentDaysCount(): number {
    return this.weeklyAttendance.filter(a => a.status === 'PRESENT').length;
  }
}