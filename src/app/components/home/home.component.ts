import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { HomeStateService } from '../../services/home-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div class="home-container">
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div class="banner-content">
          <h1>Start Your Career Journey</h1>
          <p>Discover internships that match your skills and aspirations</p>
          <button class="cta-button" (click)="router.navigate(['/internships'])">Explore Opportunities</button>
        </div>
        <div class="banner-image">
          <div class="placeholder-icon">🎯</div>
        </div>
      </div>

      <!-- Quick Search -->
      <div class="search-card">
        <h2>Find Internships</h2>
        <div class="search-form">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Select Your Course</mat-label>
            <mat-select [(ngModel)]="selectedCourse" (selectionChange)="onCourseChange()">
              <mat-option *ngFor="let course of courses" [value]="course.id">
                {{course.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="search-field" *ngIf="selectedCourse">
            <mat-label>Choose Category</mat-label>
            <mat-select [(ngModel)]="selectedCategory" (selectionChange)="onCategoryChange()">
              <mat-option *ngFor="let category of filteredCategories" [value]="category.id">
                {{category.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <!-- Companies Grid -->
      <div class="companies-section" *ngIf="companies.length > 0">
        <h2>Available Companies</h2>
        <div class="companies-grid">
          <div *ngFor="let company of companies" class="company-card" (click)="viewInternships(company)">
            <div class="company-header">
              <div class="company-logo">{{company.name.charAt(0)}}</div>
              <div class="company-info">
                <h3>{{company.name}}</h3>
                <p class="company-skills">{{company.requiredSkills || 'Various Skills'}}</p>
              </div>
            </div>
            <div class="company-actions">
              <span class="view-link">View Positions →</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Categories -->
      <div class="categories-section">
        <h2>Popular Categories</h2>
        <div class="categories-grid">
          <div class="category-card" (click)="selectPopularCategory('Software Development')">
            <div class="category-icon">💻</div>
            <h3>Software Development</h3>
            <p>Web, Mobile & Backend</p>
          </div>
          <div class="category-card" (click)="selectPopularCategory('Data Science')">
            <div class="category-icon">📊</div>
            <h3>Data Science</h3>
            <p>Analytics & Machine Learning</p>
          </div>
          <div class="category-card" (click)="selectPopularCategory('Marketing')">
            <div class="category-icon">📈</div>
            <h3>Digital Marketing</h3>
            <p>Social Media & Content</p>
          </div>
          <div class="category-card" (click)="selectPopularCategory('Design')">
            <div class="category-icon">🎨</div>
            <h3>UI/UX Design</h3>
            <p>Product & Graphic Design</p>
          </div>
        </div>
      </div>

      <!-- Getting Started -->
      <div class="getting-started">
        <h2>Getting Started</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Complete Your Profile</h4>
              <p>Add your skills, education, and experience</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Browse Internships</h4>
              <p>Find opportunities that match your interests</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Apply & Track</h4>
              <p>Submit applications and monitor progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container { max-width: 1200px; margin: 0 auto; padding: 12px; background: #f8f9fa; min-height: 100vh; }
    
    /* Welcome Banner - Smaller */
    .welcome-banner { display: flex; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 24px; border-radius: 12px; margin-bottom: 16px; }
    .banner-content { flex: 1; }
    .banner-content h1 { font-size: 22px; font-weight: 700; margin: 0 0 8px 0; }
    .banner-content p { font-size: 14px; margin: 0 0 16px 0; opacity: 0.9; }
    .cta-button { background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
    .cta-button:hover { transform: translateY(-1px); }
    .banner-image { margin-left: 20px; }
    .placeholder-icon { font-size: 40px; }
    
    /* Search Card - Smaller */
    .search-card { background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .search-card h2 { margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333; }
    .search-form { display: grid; grid-template-columns: 1fr; gap: 12px; }
    .search-field { width: 100%; }
    
    /* Companies Section - Smaller */
    .companies-section { margin-bottom: 20px; }
    .companies-section h2 { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 16px; }
    .companies-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .company-card { background: white; padding: 20px; border-radius: 12px; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .company-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .company-header { display: flex; align-items: center; margin-bottom: 12px; }
    .company-logo { width: 56px; height: 56px; background: #667eea; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600; margin-right: 16px; }
    .company-info h3 { margin: 0 0 6px 0; font-size: 20px; font-weight: 600; color: #333; }
    .company-skills { margin: 0; font-size: 15px; color: #666; }
    .view-link { color: #667eea; font-weight: 600; font-size: 16px; }
    
    /* Popular Categories - Smaller */
    .categories-section { margin-bottom: 20px; }
    .categories-section h2 { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; }
    .categories-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .category-card { background: white; padding: 12px; border-radius: 8px; text-align: center; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .category-card:hover { transform: translateY(-2px); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .category-icon { font-size: 24px; margin-bottom: 8px; }
    .category-card h3 { margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #333; }
    .category-card p { margin: 0; font-size: 11px; color: #666; }
    
    /* Getting Started - Smaller */
    .getting-started { background: white; padding: 16px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .getting-started h2 { margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333; }
    .steps { display: flex; flex-direction: column; gap: 12px; }
    .step { display: flex; align-items: flex-start; }
    .step-number { width: 24px; height: 24px; background: #667eea; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 12px; margin-right: 12px; flex-shrink: 0; }
    .step-content h4 { margin: 0 0 2px 0; font-size: 13px; font-weight: 600; color: #333; }
    .step-content p { margin: 0; font-size: 11px; color: #666; }
    
    @media (min-width: 640px) {
      .search-form { grid-template-columns: 1fr 1fr; }
      .companies-grid { grid-template-columns: repeat(2, 1fr); }
      .categories-grid { grid-template-columns: repeat(4, 1fr); }
      .steps { flex-direction: row; }
      .step { flex-direction: column; text-align: center; flex: 1; }
      .step-number { margin: 0 0 8px 0; }
    }
    @media (min-width: 768px) {
      .home-container { padding: 16px; }
      .welcome-banner { padding: 24px 28px; }
      .banner-content h1 { font-size: 24px; }
      .banner-content p { font-size: 15px; }
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

  constructor(
    private apiService: ApiService,
    public router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
    private homeStateService: HomeStateService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadCategories();
    this.restoreState();
  }

  restoreState() {
    const state = this.homeStateService.getState();
    if (state.selectedCourse) {
      this.selectedCourse = state.selectedCourse;
      this.selectedCategory = state.selectedCategory;
      this.companies = state.companies;
      
      if (this.selectedCourse) {
        this.apiService.getCategoriesByCourse(+this.selectedCourse).subscribe({
          next: (data) => {
            this.filteredCategories = data;
          }
        });
      }
    }
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
          this.homeStateService.saveState(this.selectedCourse, this.selectedCategory, this.companies);
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

  selectPopularCategory(categoryName: string) {
    // Navigate to internships page with category filter
    this.router.navigate(['/internships'], {
      queryParams: { category: categoryName }
    });
  }
}
