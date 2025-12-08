import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="header">
        <h1>Find your Intership</h1>
      </div>

      <div class="filters">
        <div class="input-group">
          <label>Course</label>
          <select [(ngModel)]="selectedCourse" (change)="onCourseChange()">
            <option value="">Choose Course</option>
            <option *ngFor="let course of courses" [value]="course.id">{{course.name}}</option>
          </select>
        </div>

        <div class="input-group" *ngIf="selectedCourse">
          <label>Category</label>
          <select [(ngModel)]="selectedCategory" (change)="onCategoryChange()">
            <option value="">Choose Category</option>
            <option *ngFor="let category of filteredCategories" [value]="category.id">{{category.name}}</option>
          </select>
        </div>
      </div>

      <div *ngIf="companies.length > 0" class="list">
        <div *ngFor="let company of companies" class="item">
          <h2>{{company.name}}</h2>
          <p *ngIf="company.website"><strong>Website:</strong> <a [href]="company.website" target="_blank">{{company.website}}</a></p>
          <p><strong>Required Skills:</strong> {{company.requiredSkills || 'Not specified'}}</p>
          <button class="btn" (click)="viewInternships(company)">View Internship</button>
        </div>
      </div>

      <div *ngIf="selectedCategory && companies.length === 0" class="empty-state">
        <p>No companies available</p>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 12px; max-width: 900px; margin: 0 auto; min-height: 100%; background: #f5f5f5; }
    .header { margin-bottom: 16px; text-align: center; }
    .header h1 { margin: 0; font-size: 18px; font-weight: 600; color: #222; }
    .filters { padding: 12px; margin-bottom: 12px; background: white; border-radius: 8px; }
    .input-group { margin-bottom: 12px; }
    .input-group:last-child { margin-bottom: 0; }
    .input-group label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: #555; }
    select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; background: white; }
    select:focus { outline: none; border-color: #2196F3; }
    .list { display: grid; gap: 12px; grid-template-columns: 1fr; }
    .item { background: white; padding: 14px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .item h2 { margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #222; }
    .item p { margin: 6px 0; font-size: 13px; color: #555; word-break: break-word; }
    .item strong { color: #222; font-weight: 500; }
    .item a { color: #2196F3; text-decoration: none; word-break: break-all; }
    .btn { background: #2196F3; color: white; border: none; padding: 10px 16px; border-radius: 4px; font-size: 13px; cursor: pointer; margin-top: 10px; width: 100%; }
    .btn:hover { background: #1976D2; }
    .empty-state { background: white; padding: 40px 20px; text-align: center; border-radius: 8px; }
    .empty-state p { margin: 0; color: #999; font-size: 14px; }
    @media (min-width: 640px) {
      .list { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 768px) {
      .page { padding: 16px; }
      .header h1 { font-size: 20px; }
      .header { margin-bottom: 20px; }
      .filters { padding: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .input-group { margin-bottom: 0; }
      .item { padding: 16px; }
      .item h2 { font-size: 16px; }
      .list { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
    }
  `]
})
export class HomeComponent implements OnInit {
  selectedCourse = '';
  selectedCategory = '';
  courses: any[] = [];
  categories: any[] = [];
  filteredCategories: any[] = [];
  companies: any[] = [];
  unreadCount = 0;

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadCategories();
  }
  


  loadCourses() {
    this.apiService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => console.error('Error loading courses:', err)
    });
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data || response;
        this.filteredCategories = this.categories;
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  onCourseChange() {
    this.selectedCategory = '';
    this.companies = [];
    
    if (this.selectedCourse) {
      this.apiService.getCategoriesByCourse(+this.selectedCourse).subscribe({
        next: (data) => {
          this.filteredCategories = data;
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          this.filteredCategories = [];
        }
      });
    } else {
      this.filteredCategories = this.categories;
    }
  }

  onCategoryChange() {
    if (this.selectedCategory) {
      this.apiService.getCompaniesByCategory(+this.selectedCategory).subscribe({
        next: (response) => {
          this.companies = response.data || response;
        },
        error: (err) => {
          console.error('Error loading companies:', err);
          this.companies = [];
        }
      });
    } else {
      this.companies = [];
    }
  }

  viewInternships(company: any) {
    this.router.navigate(['/internships'], {
      queryParams: { companyId: company.id, companyName: company.name }
    });
  }
}
