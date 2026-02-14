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
      <div class="search-card" #searchCard [class.highlight]="highlightSearch">
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
          <div *ngFor="let company of companies" class="company-card">
            <div class="company-header">
              <div class="company-logo">{{company.name.charAt(0)}}</div>
              <div class="company-info">
                <h3>{{company.name}}</h3>
                <p class="company-skills">{{company.requiredSkills || 'Various Skills'}}</p>
              </div>
            </div>
            <div class="company-actions">
              <button class="view-btn" (click)="loadInternships(company)">View Internships</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Internships Section -->
      <div class="internships-section" *ngIf="internships.length > 0">
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
      padding: 24px; 
      margin: 20px 16px; 
      border-radius: 16px; 
      box-shadow: 0 4px 16px rgba(0,0,0,0.06); 
      transition: all 0.3s ease;
      position: relative;
      z-index: 10;
    }
    .search-card.highlight { 
      border: 2px solid #667eea; 
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.25); 
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 
      0%, 100% { box-shadow: 0 8px 32px rgba(102, 126, 234, 0.25); } 
      50% { box-shadow: 0 12px 40px rgba(102, 126, 234, 0.35); }
    }
    .search-card h2 { margin: 0 0 20px 0; font-size: 22px; font-weight: 700; color: #1a1a1a; }
    .search-form { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .search-field { width: 100%; }
    
    /* Companies Section */
    .companies-section { margin: 0 16px 24px; }
    .companies-section h2 { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
    .companies-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .company-card { 
      background: white; 
      padding: 24px; 
      border-radius: 16px; 
      transition: all 0.3s; 
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }
    .company-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
    .company-header { display: flex; align-items: center; margin-bottom: 16px; }
    .company-logo { 
      width: 60px; 
      height: 60px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      border-radius: 16px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 26px; 
      font-weight: 700; 
      margin-right: 16px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    .company-info h3 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #1a1a1a; }
    .company-skills { margin: 0; font-size: 14px; color: #666; }
    .view-btn { 
      background: #667eea; 
      color: white; 
      border: none; 
      padding: 10px 20px; 
      border-radius: 8px; 
      font-size: 14px; 
      font-weight: 600; 
      cursor: pointer; 
      transition: all 0.3s;
    }
    .view-btn:hover { background: #5a67d8; transform: translateY(-1px); }
    
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
    .category-icon { font-size: 36px; margin-bottom: 12px; }
    .category-card h3 { margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #1a1a1a; }
    .category-card p { margin: 0; font-size: 12px; color: #666; line-height: 1.4; }
    
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
      .companies-grid { grid-template-columns: repeat(2, 1fr); }
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
      .search-card, .companies-section, .internships-section, .categories-section, .getting-started { 
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
    this.internships = []; // Clear internships when course changes

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
    this.internships = []; // Clear internships when category changes
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
    // Navigate to company internships page
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
    
    // Don't pass groupId for individual applications from home page
    // Only pass groupId when applying from group details page
    
    this.router.navigate(['/apply'], { queryParams });
  }

  selectPopularCategory(categoryName: string) {
    // Navigate to internships page with category filter
    this.router.navigate(['/internships'], {
      queryParams: { category: categoryName }
    });
  }
}
