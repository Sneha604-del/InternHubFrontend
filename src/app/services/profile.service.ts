import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

export interface Profile {
  id: number;
  fullName: string;
  email: string;
  college: string;
  course: string;
  isVerified: boolean;
  verificationToken: string | null;
}

export interface ProfileUpdateRequest {
  fullName: string;
  college: string;
  course: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfile(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/api/profile/${id}`);
  }

  updateProfile(id: number, request: ProfileUpdateRequest): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/api/profile/${id}`, request);
  }

  deleteProfile(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/api/profile/${id}`, { responseType: 'text' });
  }
  
  changePassword(id: number, request: PasswordChangeRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/api/profile/${id}/password`, request, { responseType: 'text' });
  }
}
