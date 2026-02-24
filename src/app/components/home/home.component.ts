import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { HomeStateService } from '../../services/home-state.service';
import { GroupService } from '../../services/group.service';
import { CompanyResultsComponent } from '../company-results/company-results.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule, CompanyResultsComponent],
  template: `
    <div class="home-container" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" (touchend)="onTouchEnd()">
      <div class="pull-indicator" [class.visible]="pullDistance > 0">
        <div class="pull-content">
          <i class="pi pi-refresh" [class.spin]="refreshing"></i>
          <span>{{pullDistance >= 80 ? 'Release to refresh' : 'Pull to refresh'}}</span>
        </div>
      </div>
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

      <!-- Skeleton Loading -->
      <div *ngIf="loading" class="skeleton-wrapper">
        <div class="skeleton-search">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-field"></div>
          <div class="skeleton-field"></div>
        </div>
        <div class="skeleton-categories">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-grid">
            <div class="skeleton-card" *ngFor="let i of [1,2,3,4]"></div>
          </div>
        </div>
      </div>

      <!-- Quick Search -->
      <div *ngIf="!loading" class="search-card" #searchCard [class.highlight]="highlightSearch">
        <div class="search-header">
          <h2>Find Internships</h2>
        </div>
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

      <!-- Companies Results Component -->
      <div *ngIf="loadingCompanies" class="skeleton-companies">
        <div class="skeleton-line skeleton-title" style="width: 40%; margin: 0 16px 12px;"></div>
        <div class="skeleton-companies-grid">
          <div class="skeleton-company-card" *ngFor="let i of [1,2,3,4,5,6]"></div>
        </div>
      </div>
      
      <app-company-results 
        *ngIf="!loadingCompanies"
        [companies]="companies"
        (viewInternships)="loadInternships($event)">
      </app-company-results>

      <!-- Internships Section -->
      <div *ngIf="loadingInternships" class="skeleton-internships">
        <div class="skeleton-line skeleton-title" style="width: 50%; margin: 0 16px 16px;"></div>
        <div class="skeleton-internships-grid">
          <div class="skeleton-internship-card" *ngFor="let i of [1,2,3]">
            <div class="skeleton-line" style="height: 20px; width: 60%; margin-bottom: 16px;"></div>
            <div class="skeleton-line" style="height: 14px; width: 80%; margin-bottom: 8px;"></div>
            <div class="skeleton-line" style="height: 14px; width: 70%; margin-bottom: 8px;"></div>
            <div class="skeleton-line" style="height: 14px; width: 75%; margin-bottom: 12px;"></div>
            <div class="skeleton-line" style="height: 40px; width: 100%;"></div>
          </div>
        </div>
      </div>
      
      <div class="internships-section" *ngIf="!loadingInternships && internships.length > 0">
        <h2>Available Internships at {{selectedCompanyName}}</h2>
        <div class="internships-grid">
          <div *ngFor="let internship of internships" class="internship-card">
            <h3>{{internship.title}}</h3>
            <div class="internship-details">
              <p><strong>Location:</strong> {{internship.location}}</p>
              <p><strong>Duration:</strong> {{internship.duration}}</p>
              <p><strong>Stipend:</strong> {{internship.stipend}}</p>
              <div class="badge" [class.paid]="internship.isPaid" [class.free]="!internship.isPaid">
                {{internship.isPaid ? 'PAID' : 'FREE'}}
              </div>
            </div>
            <button class="apply-btn" (click)="applyNow(internship, $event)">Apply Now</button>
          </div>
        </div>
      </div>

      <!-- Popular Categories -->
      <div *ngIf="!loading" class="categories-section">
        <h2>Popular Categories</h2>
        <div class="categories-grid">
          <div class="category-card" (click)="selectPopularCategory('Software Development')">
            <div class="category-icon"><i class="pi pi-desktop"></i></div>
            <h3>Software Development</h3>
            <p>Web, Mobile & Backend</p>
          </div>
          <div class="category-card" (click)="selectPopularCategory('Data Science')">
            <div class="category-icon"><i class="pi pi-chart-bar"></i></div>
            <h3>Data Science</h3>
            <p>Analytics & Machine Learning</p>
          </div>
          <div class="category-card" (click)="selectPopularCategory('Marketing')">
            <div class="category-icon"><i class="pi pi-chart-line"></i></div>
            <h3>Digital Marketing</h3>
            <p>Social Media & Content</p>
          </div>
          <div class="category-card" (click)="selectPopularCategory('Design')">
            <div class="category-icon"><i class="pi pi-palette"></i></div>
            <h3>UI/UX Design</h3>
            <p>Product & Graphic Design</p>
          </div>
        </div>
      </div>

      <!-- Latest News -->
      <div *ngIf="!loading && newsList.length > 0" class="news-section">
        <h2>Latest Internship Opportunities</h2>
        <div class="news-carousel">
          <div *ngFor="let news of newsList" class="news-item">
            <h3>{{ news.title }}</h3>
            <p>{{ news.content }}</p>
            <button class="apply-news-btn" (click)="applyFromNews(news)">Apply Now</button>
          </div>
        </div>
      </div>

      <!-- Getting Started -->
      <div *ngIf="!loading" class="getting-started">
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
    .home-container { 
      max-width: 100%;
      margin: 0;
      padding: 0;
      background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
      min-height: 100vh;
      padding-bottom: 90px;
    }
    
    /* Welcome Banner */
    .welcome-banner { 
      display: flex; 
      align-items: center; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 24px 20px; 
      margin: 0;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
    }
    .banner-content { flex: 1; max-width: 600px; margin: 0 auto; text-align: center; }
    .banner-content h1 { font-size: 20px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.3; }
    .banner-content p { font-size: 13px; margin: 0 0 16px 0; opacity: 0.95; line-height: 1.4; }
    .cta-button { 
      background: white; 
      color: #667eea; 
      border: none; 
      padding: 10px 24px; 
      border-radius: 8px; 
      font-size: 14px; 
      font-weight: 600; 
      cursor: pointer; 
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .cta-button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .banner-image { display: none; }
    
    /* Search Card */
    .search-card { 
      background: white; 
      padding: 20px; 
      margin: 16px 16px; 
      border-radius: 16px; 
      box-shadow: 0 4px 16px rgba(0,0,0,0.06); 
      transition: all 0.3s ease;
      position: relative;
      z-index: 10;
      overflow: hidden;
    }
    .pull-indicator { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; opacity: 0; transition: opacity 0.2s; }
    .pull-indicator.visible { opacity: 1; }
    .pull-content { display: flex; align-items: center; gap: 8px; color: white; padding: 10px 16px; font-size: 13px; font-weight: 600; white-space: nowrap; }
    .pull-content i { font-size: 16px; }
    .pull-content i.spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .search-card.highlight { 
      border: 2px solid #667eea; 
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.25); 
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 
      0%, 100% { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.25); } 
      50% { box-shadow: 0 12px 40px rgba(102, 126, 234, 0.35); }
    }
    
    /* Skeleton Loading */
    .skeleton-wrapper { margin: 16px; }
    .skeleton-search { background: white; padding: 20px; border-radius: 16px; margin-bottom: 16px; }
    .skeleton-line { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
    .skeleton-title { height: 20px; width: 40%; margin-bottom: 14px; }
    .skeleton-field { height: 56px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; margin-bottom: 10px; }
    .skeleton-categories { background: white; padding: 20px; border-radius: 16px; }
    .skeleton-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .skeleton-card { height: 120px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 16px; }
    
    .skeleton-companies { margin: 0 16px 20px; }
    .skeleton-companies-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin: 0 16px; }
    .skeleton-company-card { height: 200px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
    
    .skeleton-internships { margin: 0 16px 24px; }
    .skeleton-internships-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin: 0 16px; }
    .skeleton-internship-card { background: white; padding: 24px; border-radius: 16px; border-left: 4px solid #e0e0e0; }
    
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .search-card h2 { margin: 0 0 14px 0; font-size: 20px; font-weight: 700; color: #1a1a1a; }
    .search-header { margin-bottom: 14px; }
    .search-form { display: grid; grid-template-columns: 1fr; gap: 10px; }
    .search-field { width: 100%; }
    
    ::ng-deep .search-field .mat-mdc-form-field {
      height: auto;
    }
    
    ::ng-deep .search-field .mat-mdc-text-field-wrapper {
      padding: 0 !important;
    }
    
    ::ng-deep .search-field .mat-mdc-form-field-infix {
      padding: 6px 0 !important;
    }
    
    ::ng-deep .search-field .mat-mdc-select {
      min-height: 38px !important;
      padding: 8px 12px !important;
      font-size: 14px !important;
    }
    
    /* Internships Section */
    .internships-section { margin: 0 16px 24px; }
    .internships-section h2 { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
    .internships-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .internship-card { 
      background: white; 
      padding: 24px; 
      border-radius: 16px; 
      transition: all 0.3s; 
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      border-left: 4px solid #667eea;
    }
    .internship-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
    .internship-card h3 { margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #1a1a1a; }
    .internship-details p { margin: 8px 0; font-size: 14px; color: #555; }
    .internship-details strong { color: #333; font-weight: 600; }
    .badge { 
      display: inline-block; 
      padding: 4px 12px; 
      border-radius: 6px; 
      font-size: 12px; 
      font-weight: 600; 
      margin: 12px 0 16px 0; 
    }
    .badge.paid { background: #4CAF50; color: white; }
    .badge.free { background: #FF9800; color: white; }
    .apply-btn { 
      background: #2196F3; 
      color: white; 
      border: none; 
      padding: 12px 24px; 
      border-radius: 8px; 
      font-size: 16px; 
      font-weight: 600; 
      cursor: pointer; 
      width: 100%; 
      transition: all 0.3s;
    }
    .apply-btn:hover { background: #1976D2; transform: translateY(-1px); }
    
    /* Popular Categories */
    .categories-section { margin: 0 16px 24px; }
    .categories-section h2 { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
    .categories-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .category-card { 
      background: white; 
      padding: 20px 16px; 
      border-radius: 16px; 
      text-align: center; 
      cursor: pointer; 
      transition: all 0.3s; 
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }
    .category-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .category-icon { font-size: 36px; margin-bottom: 12px; color: #667eea; }
    .category-icon i { font-size: 36px; }
    .category-card h3 { margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #1a1a1a; }
    .category-card p { margin: 0; font-size: 12px; color: #666; line-height: 1.4; }
    
    /* Latest News */
    .news-section { margin: 0 16px 24px; }
    .news-section h2 { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
    .news-carousel { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
    .news-carousel::-webkit-scrollbar { height: 6px; }
    .news-carousel::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
    .news-carousel::-webkit-scrollbar-thumb { background: #007bff; border-radius: 10px; }
    .news-item { 
      min-width: 280px; 
      background: white; 
      padding: 20px; 
      border-radius: 12px; 
      border: 1px solid #e9ecef;
      border-left: 4px solid #007bff;
      scroll-snap-align: start; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
    }
    .news-item:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); border-left-color: #0056b3; }
    .news-item h3 { margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #2c3e50; }
    .news-item p { margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #495057; flex: 1; }
    .apply-news-btn { 
      background: #007bff; 
      color: white; 
      border: none; 
      padding: 12px 20px; 
      border-radius: 8px; 
      font-size: 14px; 
      font-weight: 600; 
      cursor: pointer; 
      width: 100%; 
      transition: all 0.3s;
    }
    .apply-news-btn:hover { background: #0056b3; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3); }
    
    /* Getting Started */
    .getting-started { 
      background: white; 
      padding: 24px; 
      margin: 0 16px 24px;
      border-radius: 16px; 
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }
    .getting-started h2 { margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #1a1a1a; }
    .steps { display: flex; flex-direction: column; gap: 20px; }
    .step { display: flex; align-items: flex-start; }
    .step-number { 
      width: 40px; 
      height: 40px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: 700; 
      font-size: 18px; 
      margin-right: 16px; 
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    .step-content h4 { margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #1a1a1a; }
    .step-content p { margin: 0; font-size: 14px; color: #666; line-height: 1.6; }
    
    @media (min-width: 640px) {
      .search-form { grid-template-columns: 1fr 1fr; }
      .internships-grid { grid-template-columns: repeat(2, 1fr); }
      .categories-grid { grid-template-columns: repeat(4, 1fr); }
      .banner-image { display: block; margin-left: 32px; }
      .placeholder-icon { font-size: 64px; }
      .banner-content { text-align: left; }
    }
    @media (min-width: 768px) {
      .home-container { padding-bottom: 90px; }
      .welcome-banner { padding: 48px 32px; }
      .banner-content h1 { font-size: 36px; }
      .banner-content p { font-size: 18px; }
      .search-card, .internships-section, .categories-section, .getting-started { 
        margin-left: auto; 
        margin-right: auto; 
        max-width: 1200px; 
        padding-left: 32px;
        padding-right: 32px;
      }
      .steps { flex-direction: row; }
      .step { flex-direction: column; text-align: center; flex: 1; }
      .step-number { margin: 0 0 12px 0; }
    }
    
    /* Fix dropdown transparency */
    ::ng-deep .mat-mdc-select-panel {
      background-color: #f3f4f6 !important;
      opacity: 1 !important;
    }
    
    ::ng-deep .mat-mdc-option {
      background-color: #f3f4f6 !important;
      color: #1f2937 !important;
    }
    
    ::ng-deep .mat-mdc-option:hover {
      background-color: #e5e7eb !important;
    }
    
    ::ng-deep .mat-mdc-option.mat-selected {
      background-color: #d1d5db !important;
      color: #1f2937 !important;
    }
  `]
})
export class HomeComponent implements OnInit {
  @ViewChild('searchCard') searchCard!: ElementRef;
  
  selectedCourse = '';
  selectedCategory = '';
  courses: any[] = [];
  categories: any[] = [];
  filteredCategories: any[] = [];
  companies: any[] = [];
  internships: any[] = [];
  selectedCompanyId: number = 0;
  selectedCompanyName: string = '';
  userGroup: any = null;
  highlightSearch = false;
  refreshing = false;
  pullDistance = 0;
  startY = 0;
  isPulling = false;
  loading = true;
  loadingCompanies = false;
  loadingInternships = false;
  newsList: any[] = [];

  constructor(
    private apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private authService: AuthService,
    private homeStateService: HomeStateService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadCategories();
    this.loadNews();
    this.restoreState();
    this.checkForGroupRedirect();
    this.loadUserGroup();
  }

  checkForGroupRedirect() {
    this.route.queryParams.subscribe(params => {
      if (params['groupId']) {
        this.highlightSearch = true;
        setTimeout(() => {
          this.searchCard?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        setTimeout(() => {
          this.highlightSearch = false;
        }, 5000);
      }
    });
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
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.loading = false;
      }
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

  loadNews() {
    this.apiService.getNews().subscribe({
      next: (data) => {
        this.newsList = data.slice(0, 5);
      },
      error: (err) => console.error('Error loading news:', err)
    });
  }

  onCourseChange() {
    this.selectedCategory = '';
    this.companies = [];
    this.internships = [];

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
    this.internships = [];
    if (this.selectedCategory) {
      this.loadingCompanies = true;
      this.apiService.getCompaniesByCategory(+this.selectedCategory).subscribe({
        next: (response) => {
          this.companies = response.data || response;
          this.homeStateService.saveState(this.selectedCourse, this.selectedCategory, this.companies);
          this.loadingCompanies = false;
        },
        error: (err) => {
          console.error('Error loading companies:', err);
          this.companies = [];
          this.loadingCompanies = false;
        }
      });
    } else {
      this.companies = [];
    }
  }

  loadUserGroup() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.groupService.getUserGroup(currentUser.id).subscribe({
        next: (group) => {
          this.userGroup = group;
        },
        error: (error) => {
          console.error('Error loading user group:', error);
        }
      });
    }
  }

  loadInternships(company: any) {
    this.router.navigate(['/company-internships'], {
      queryParams: {
        companyId: company.id,
        companyName: company.name,
        categoryId: this.selectedCategory
      }
    });
  }

  applyNow(internship: any, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const queryParams: any = { 
      internshipId: internship.id,
      companyId: this.selectedCompanyId,
      companyName: this.selectedCompanyName
    };
    
    this.router.navigate(['/apply'], { queryParams });
  }

  selectPopularCategory(categoryName: string) {
    const category = this.categories.find(cat => 
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    );
    
    if (category) {
      this.selectedCategory = category.id.toString();
      this.onCategoryChange();
      setTimeout(() => {
        this.searchCard?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  refreshData() {
    this.refreshing = true;
    this.loadCourses();
    this.loadCategories();
    this.loadNews();
    setTimeout(() => {
      this.refreshing = false;
    }, 1000);
  }

  onTouchStart(event: TouchEvent) {
    if (window.scrollY === 0) {
      this.startY = event.touches[0].clientY;
      this.isPulling = true;
    }
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isPulling || this.refreshing) return;
    const currentY = event.touches[0].clientY;
    const distance = currentY - this.startY;
    if (distance > 0 && window.scrollY === 0) {
      this.pullDistance = Math.min(distance * 0.5, 100);
      if (this.pullDistance > 10) {
        event.preventDefault();
      }
    }
  }

  onTouchEnd() {
    if (this.pullDistance >= 80 && !this.refreshing) {
      this.refreshData();
    }
    this.isPulling = false;
    this.pullDistance = 0;
  }

  formatNewsDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  applyFromNews(news: any) {
    console.log('News data:', news);
    this.router.navigate(['/apply'], {
      queryParams: {
        internshipId: news.internshipId || news.id,
        companyId: news.companyId || 0,
        companyName: news.companyName || news.title || 'Company'
      }
    });
  }
}
