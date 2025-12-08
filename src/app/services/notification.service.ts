import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environment';

export interface Notification {
  id: number;
  studentId: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl;
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(studentId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/api/notifications/${studentId}`);
  }

  getUnreadCount(studentId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/api/notifications/${studentId}/unread-count`);
  }

  markAsRead(notificationId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/api/notifications/${notificationId}/read`, {}, { responseType: 'text' });
  }

  markAllAsRead(studentId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/api/notifications/${studentId}/read-all`, {}, { responseType: 'text' });
  }

  updateUnreadCount(count: number) {
    this.unreadCountSubject.next(count);
  }

  loadUnreadCount(studentId: number) {
    this.getUnreadCount(studentId).subscribe(count => this.updateUnreadCount(count));
  }
}