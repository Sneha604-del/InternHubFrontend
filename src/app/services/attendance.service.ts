import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { AttendanceRequest, AttendanceResponse, AttendanceStatus } from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/api/attendance`;

  constructor(private http: HttpClient) {}

  markAttendance(request: AttendanceRequest): Observable<AttendanceResponse> {
    return this.http.post<AttendanceResponse>(`${this.apiUrl}/checkin`, request);
  }

  getStudentAttendance(studentId: number): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getGroupAttendance(groupId: number): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/group/${groupId}`);
  }

  getGroupAttendanceByDateRange(groupId: number, startDate: string, endDate: string): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/group/${groupId}/date-range`, {
      params: { startDate, endDate }
    });
  }

  getAllAttendance(): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(`${this.apiUrl}/all`);
  }
}