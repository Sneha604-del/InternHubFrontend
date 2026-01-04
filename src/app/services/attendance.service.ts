import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

export interface Attendance {
  id?: number;
  userId: number;
  groupId: number;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  notes?: string;
  isManual: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/api/attendance`;

  constructor(private http: HttpClient) {}

  checkIn(userId: number, groupId: number): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/check-in`, { userId, groupId });
  }

  checkOut(userId: number): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/check-out`, { userId });
  }

  markManualAttendance(userId: number, groupId: number, date: string, status: string, notes?: string): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/manual`, { userId, groupId, date, status, notes });
  }

  getUserAttendance(userId: number, startDate: string, endDate: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/user/${userId}?startDate=${startDate}&endDate=${endDate}`);
  }

  getGroupAttendance(groupId: number, date: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/group/${groupId}?date=${date}`);
  }

  getUserTotalHours(userId: number, startDate: string, endDate: string): Observable<{totalHours: number}> {
    return this.http.get<{totalHours: number}>(`${this.apiUrl}/user/${userId}/hours?startDate=${startDate}&endDate=${endDate}`);
  }

  getTodayAttendance(userId: number): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.apiUrl}/user/${userId}/today`);
  }
}