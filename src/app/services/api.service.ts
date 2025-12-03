import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/company-categories`);
  }

  getCompaniesByCategory(categoryId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/companies/category/${categoryId}`);
  }

  getInternshipsByCompany(companyId: number, companyName?: string): Observable<any> {
    let url = `${this.baseUrl}/admin/internships?companyId=${companyId}`;
    if (companyName) {
      url += `&companyName=${encodeURIComponent(companyName)}`;
    }
    return this.http.get(url);
  }
}
