import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/api/student/documents`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/applications`, { headers: this.getHeaders() });
  }

  getCertificates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/certificates`, { headers: this.getHeaders() });
  }

  getCertificateContent(fileName: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/certificates/${fileName}`, { 
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  getFileUrl(filePath: string): string {
    return `${environment.apiUrl}${filePath}`;
  }
}
