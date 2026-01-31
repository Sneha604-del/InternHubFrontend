import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AttendanceService } from '../../services/attendance.service';
import { GeolocationService, LocationCoordinates } from '../../services/geolocation.service';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AttendanceRequest, AttendanceResponse } from '../../models/attendance.model';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, RouterModule]
})
export class AttendanceComponent implements OnInit {
  isLoading = false;
  hasJoinedGroup = false;
  currentGroup: Group | null = null;
  todayAttendance: AttendanceResponse | null = null;
  locationPermissionGranted = false;
  currentLocation: LocationCoordinates | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private geolocationService: GeolocationService,
    private groupService: GroupService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.checkStudentGroupStatus();
    this.requestLocationPermission();
  }

  async checkStudentGroupStatus() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;

      this.groupService.getUserGroup(currentUser.id!).subscribe({
        next: (group: Group | null) => {
          console.log('User group:', group);
          if (group && (group.status === 'SELECTED' || group.status === 'APPROVED' || group.company)) {
            this.hasJoinedGroup = true;
            this.currentGroup = group;
            this.checkTodayAttendance();
          }
        },
        error: (error: any) => {
          console.error('Error fetching groups:', error);
        }
      });
    } catch (error) {
      console.error('Error checking group status:', error);
    }
  }

  async requestLocationPermission() {
    try {
      const location = await this.geolocationService.getCurrentPosition().toPromise();
      this.currentLocation = location || null;
      this.locationPermissionGranted = true;
      this.toastService.showSuccess('Location obtained successfully');
    } catch (error: any) {
      this.locationPermissionGranted = false;
      console.error('Location permission denied:', error);
    }
  }

  async getCurrentLocation() {
    try {
      this.isLoading = true;
      const location = await this.geolocationService.getCurrentPosition().toPromise();
      this.currentLocation = location || null;
      this.locationPermissionGranted = true;
      this.toastService.showSuccess('Location obtained successfully');
    } catch (error: any) {
      this.toastService.showError(error.message || 'Failed to get location');
      this.locationPermissionGranted = false;
    } finally {
      this.isLoading = false;
    }
  }

  async markAttendance() {
    if (!this.hasJoinedGroup || !this.currentGroup) {
      this.toastService.showError('You are not enrolled in any internship group');
      return;
    }

    if (!this.locationPermissionGranted || !this.currentLocation) {
      await this.getCurrentLocation();
      if (!this.currentLocation) return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.toastService.showError('User not authenticated');
      return;
    }

    this.isLoading = true;

    const request: AttendanceRequest = {
      studentId: currentUser.id!,
      groupId: this.currentGroup.id!,
      latitude: this.currentLocation.latitude,
      longitude: this.currentLocation.longitude
    };

    console.log('Sending attendance request:', request);

    this.attendanceService.markAttendance(request).subscribe({
      next: (response) => {
        if (response.message?.includes('successfully')) {
          this.toastService.showSuccess(response.message);
          this.todayAttendance = response;
        } else {
          this.toastService.showError(response.message || 'Failed to mark attendance');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Full error:', error);
        console.error('Error response:', error.error);
        console.error('Error message:', error.error?.message);
        const errorMessage = error.error?.message || 'Failed to mark attendance';
        this.toastService.showError(errorMessage);
        this.isLoading = false;
      }
    });
  }

  checkTodayAttendance() {
    if (!this.currentGroup) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.attendanceService.getStudentAttendance(currentUser.id!).subscribe({
      next: (attendances) => {
        const today = new Date().toISOString().split('T')[0];
        this.todayAttendance = attendances.find(a => 
          a.attendanceDate === today
        ) || null;
      },
      error: (error) => {
        console.error('Error checking today attendance:', error);
      }
    });
  }

  getStatusColor(status?: string): string {
    switch (status) {
      case 'PRESENT': return 'success';
      case 'LOCATION_MISMATCH': return 'warning';
      case 'ABSENT': return 'danger';
      default: return 'medium';
    }
  }

  getStatusText(status?: string): string {
    switch (status) {
      case 'PRESENT': return 'Present';
      case 'LOCATION_MISMATCH': return 'Location Mismatch';
      case 'ABSENT': return 'Absent';
      default: return 'Unknown';
    }
  }
}