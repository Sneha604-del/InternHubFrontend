import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environment';
import { RegistrationRequest, LoginRequest, LoginResponse, Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Student | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user && user !== 'undefined') {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }

  register(request: RegistrationRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, request, { responseType: 'text' });
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, request)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.student));
          this.currentUserSubject.next(response.student);
          
          // Log login activity
          if (response.student.id) {
            this.logLoginActivity(response.student.id);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): Student | null {
    const user = this.currentUserSubject.value;
    console.log('AuthService getCurrentUser:', user);
    return user;
  }

  private logLoginActivity(studentId: number): void {
    const deviceInfo = this.getDeviceInfo();
    const loginData = {
      studentId: studentId,
      ipAddress: 'Unknown', // Will be set by backend
      deviceInfo: deviceInfo,
      location: 'Unknown' // Will be set by backend or geolocation
    };

    this.http.post(`${this.apiUrl}/api/security/login-activity`, loginData).subscribe({
      next: () => console.log('Login activity logged'),
      error: (error) => console.error('Failed to log login activity:', error)
    });
  }

  private getDeviceInfo(): string {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect browser
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Detect OS
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return `${browser} on ${os}`;
  }
}