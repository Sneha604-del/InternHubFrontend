import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { ToastService } from '../../services/toast.service';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, FileUploadModule, InputNumberModule, PanelModule],
  template: `
    <div class="apply-container">
      <div class="apply-header">
        <i class="pi pi-users"></i>
        <h1>Group Application</h1>
        <p *ngIf="groupInfo">Applying as: <strong>{{groupInfo.groupName}}</strong></p>
      </div>

      <form (ngSubmit)="onSubmit()" #applyForm="ngForm" class="apply-form">
        <p-panel *ngIf="groupInfo" header="Group Information" [toggleable]="false">
          <div class="info-grid">
            <div class="info-item">
              <label>Group Name:</label>
              <span>{{groupInfo.groupName}}</span>
            </div>
            <div class="info-item">
              <label>College:</label>
              <span>{{groupInfo.collegeName}}</span>
            </div>
            <div class="info-item">
              <label>Department:</label>
              <span>{{groupInfo.department}}</span>
            </div>
            <div class="info-item">
              <label>Total Students:</label>
              <span>{{groupInfo.totalStudents}}</span>
            </div>
          </div>
        </p-panel>

        <p-panel *ngIf="groupInfo" header="Team Details" [toggleable]="false" styleClass="team-panel">
          <div class="p-fluid">
            <div class="field">
              <label for="teamSize">Actual Team Size *</label>
              <p-inputNumber id="teamSize" [(ngModel)]="teamData.teamSize" name="teamSize" 
                             [required]="true" styleClass="w-full"></p-inputNumber>
            </div>

            <div class="field">
              <label for="teamLeader">Team Leader Name *</label>
              <input pInputText id="teamLeader" [(ngModel)]="teamData.teamLeader" name="teamLeader" 
                     required class="w-full" placeholder="Enter team leader name" />
            </div>

            <div class="field">
              <label for="leaderContact">Team Leader Contact *</label>
              <input pInputText id="leaderContact" [(ngModel)]="teamData.leaderContact" name="leaderContact" 
                     required class="w-full" placeholder="Enter contact number" />
            </div>

            <div class="field">
              <label for="leaderEmail">Team Leader Email *</label>
              <input pInputText id="leaderEmail" type="email" [(ngModel)]="teamData.leaderEmail" name="leaderEmail" 
                     required class="w-full" placeholder="Enter email address" />
            </div>

            <div class="field">
              <label for="teamMembers">Team Members (Names) *</label>
              <textarea id="teamMembers" [(ngModel)]="teamData.teamMembers" name="teamMembers" 
                        required class="w-full p-inputtext p-component" rows="4" 
                        placeholder="Enter all team member names (one per line)&#10;Example:&#10;John Smith&#10;Jane Doe&#10;Mike Johnson"></textarea>
            </div>

            <div class="field">
              <label for="memberEmails">Team Member Emails</label>
              <textarea id="memberEmails" [(ngModel)]="teamData.memberEmails" name="memberEmails" 
                        class="w-full p-inputtext p-component" rows="3" 
                        placeholder="Enter team member emails (one per line)&#10;john@example.com&#10;jane@example.com"></textarea>
            </div>

            <div class="field">
              <label for="academicYear">Academic Year *</label>
              <select id="academicYear" [(ngModel)]="teamData.academicYear" name="academicYear" 
                      required class="w-full p-inputtext p-component">
                <option value="">Select academic year</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>

            <div class="field">
              <label for="semester">Current Semester *</label>
              <select id="semester" [(ngModel)]="teamData.semester" name="semester" 
                      required class="w-full p-inputtext p-component">
                <option value="">Select semester</option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </select>
            </div>

            <div class="field">
              <label for="skills">Team Skills & Expertise</label>
              <textarea id="skills" [(ngModel)]="teamData.skills" name="skills" 
                        class="w-full p-inputtext p-component" rows="3" 
                        placeholder="List key skills and expertise of your team&#10;Example: Java, React, Python, UI/UX Design, Database Management"></textarea>
            </div>

            <div class="field">
              <label for="experience">Previous Project Experience</label>
              <textarea id="experience" [(ngModel)]="teamData.experience" name="experience" 
                        class="w-full p-inputtext p-component" rows="3" 
                        placeholder="Describe any relevant projects or experience your team has worked on together"></textarea>
            </div>

            <div class="field">
              <label for="motivation">Why This Internship? *</label>
              <textarea id="motivation" [(ngModel)]="teamData.motivation" name="motivation" 
                        required class="w-full p-inputtext p-component" rows="4" 
                        placeholder="Explain why your team is interested in this internship and what you hope to achieve"></textarea>
            </div>
          </div>
        </p-panel>

        <hr style="margin: 32px 0; border: none; border-top: 1px solid #dee2e6;">

        <p-panel header="Educational Information" [toggleable]="false">
          <div class="p-fluid">
            <div class="field">
              <label for="college">Name of your college *</label>
              <input pInputText id="college" [(ngModel)]="applicationData.college" name="college" required class="w-full" />
            </div>

            <div class="field">
              <label for="degree">Degree you are studying *</label>
              <input pInputText id="degree" [(ngModel)]="applicationData.degree" name="degree" required class="w-full" />
            </div>

            <div class="field">
              <label for="yearOfStudy">Year of study *</label>
              <select id="yearOfStudy" [(ngModel)]="applicationData.yearOfStudy" name="yearOfStudy" 
                      required class="w-full p-inputtext p-component">
                <option value="">Select year</option>
                <option value="1st year">1st year</option>
                <option value="2nd year">2nd year</option>
                <option value="3rd year">3rd year</option>
                <option value="4th year">4th year</option>
                <option value="5th year">5th year</option>
              </select>
            </div>
          </div>
        </p-panel>

        <p-panel header="Documents for Verification" [toggleable]="false">
          <div class="p-fluid">
            <div class="field">
              <label>{{groupInfo ? 'Group Leader\'s Student ID card' : 'Student ID card'}} *</label>
              <input #studentIdInput type="file" (change)="onFileSelect($event, 'studentId')" 
                     accept=".pdf,.jpg,.jpeg,.png" required style="display: none;">
              <p-button (onClick)="studentIdInput.click()" [label]="studentIdFileName || 'Choose File'" 
                        icon="pi pi-upload" styleClass="w-full p-button-outlined"></p-button>
              <small class="file-hint">Upload PDF, JPG, or PNG (Max 5MB)</small>
            </div>

            <div class="field">
              <label>{{groupInfo ? 'Group Resume/Portfolio' : 'Resume/CV'}} *</label>
              <input #resumeInput type="file" (change)="onFileSelect($event, 'resume')" 
                     accept=".pdf" required style="display: none;">
              <p-button (onClick)="resumeInput.click()" [label]="resumeFileName || 'Choose File'" 
                        icon="pi pi-upload" styleClass="w-full p-button-outlined"></p-button>
              <small class="file-hint">Upload PDF only (Max 5MB)</small>
            </div>
          </div>
        </p-panel>

        <div class="form-actions">
          <p-button type="submit" [label]="loading ? 'Submitting...' : (groupInfo ? 'Submit Group Application' : 'Submit Application')" 
                    [disabled]="!isFormValid() || loading" [loading]="loading" 
                    icon="pi pi-check" styleClass="w-full submit-btn"></p-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .apply-container { max-width: 800px; margin: 0 auto; padding: 24px; min-height: 100vh; }
    .apply-header { margin-bottom: 32px; text-align: center; }
    .apply-header i { font-size: 32px; color: #667eea; }
    .apply-header h1 { margin: 8px 0 4px 0; font-size: 28px; font-weight: 600; color: #333; }
    .apply-header p { margin: 0; color: #666; font-size: 14px; }
    .apply-form { }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .info-item { display: flex; flex-direction: column; }
    .info-item label { font-weight: 600; color: #555; font-size: 12px; margin-bottom: 4px; }
    .info-item span { color: #333; font-size: 14px; }
    .field { margin-bottom: 20px; }
    .field label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 14px; }
    .w-full { width: 100%; }
    .form-actions { margin-top: 24px; }
    .submit-btn { height: 48px; font-size: 16px; font-weight: 600; }
    .file-hint { display: block; margin-top: 8px; font-size: 12px; color: #666; }
    ::ng-deep .p-panel { margin-bottom: 24px; }
    ::ng-deep .p-panel .p-panel-header { background: #f8f9fa; border-bottom: 1px solid #dee2e6; }
    ::ng-deep .p-panel .p-panel-content { padding: 24px; }
    ::ng-deep .team-panel .p-panel-header { background: #e3f2fd; }
    ::ng-deep .p-divider { margin: 32px 0; }
    @media (max-width: 768px) { 
      .info-grid { grid-template-columns: 1fr; }
      .apply-container { padding: 16px; }
    }
  `]
})
export class ApplyComponent implements OnInit {
  internshipId: number = 0;
  companyId: number = 0;
  companyName: string = '';
  groupId: number = 0;
  groupInfo: any = null;
  currentYear = new Date().getFullYear();
  loading = false;

  applicationData = {
    college: '',
    degree: '',
    yearOfStudy: '',
    studentId: null as File | null,
    resume: null as File | null
  };

  teamData = {
    teamSize: 1,
    teamLeader: '',
    leaderContact: '',
    leaderEmail: '',
    teamMembers: '',
    memberEmails: '',
    academicYear: '',
    semester: '',
    skills: '',
    experience: '',
    motivation: ''
  };

  studentIdFileName = '';
  resumeFileName = '';

  yearOptions = [
    { label: '1st year', value: '1st year' },
    { label: '2nd year', value: '2nd year' },
    { label: '3rd year', value: '3rd year' },
    { label: '4th year', value: '4th year' },
    { label: '5th year', value: '5th year' }
  ];

  academicYearOptions = [
    { label: '2023-24', value: '2023-24' },
    { label: '2024-25', value: '2024-25' },
    { label: '2025-26', value: '2025-26' }
  ];

  semesterOptions = [
    { label: '1st Semester', value: '1st Semester' },
    { label: '2nd Semester', value: '2nd Semester' },
    { label: '3rd Semester', value: '3rd Semester' },
    { label: '4th Semester', value: '4th Semester' },
    { label: '5th Semester', value: '5th Semester' },
    { label: '6th Semester', value: '6th Semester' },
    { label: '7th Semester', value: '7th Semester' },
    { label: '8th Semester', value: '8th Semester' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService,
    private groupService: GroupService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.internshipId = +params['internshipId'];
      this.companyId = +params['companyId'];
      this.companyName = params['companyName'] || '';
      this.groupId = +params['groupId'];
      
      if (this.groupId) {
        this.loadGroupInfo();
      }
    });
  }

  loadGroupInfo() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.groupService.getUserGroup(currentUser.id).subscribe({
        next: (group) => {
          this.groupInfo = group;
          if (group) {
            this.applicationData.college = group.collegeName || '';
            this.teamData.teamSize = group.totalStudents || 1;
            this.teamData.academicYear = group.academicYear || '';
            this.teamData.teamLeader = currentUser.fullName || '';
            this.teamData.leaderEmail = currentUser.email || '';
          }
        },
        error: (error) => {
          console.error('Error loading group info:', error);
        }
      });
    }
  }

  onFileSelect(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.showError('File size must be less than 5MB', 'File Error');
        event.target.value = '';
        return;
      }
      (this.applicationData as any)[field] = file;
      if (field === 'studentId') {
        this.studentIdFileName = file.name;
      } else if (field === 'resume') {
        this.resumeFileName = file.name;
      }
    }
  }

  isFormValid(): boolean {
    const basicValid = this.applicationData.college.trim() !== '' &&
                      this.applicationData.degree.trim() !== '' &&
                      this.applicationData.yearOfStudy !== '' &&
                      this.applicationData.studentId !== null &&
                      this.applicationData.resume !== null;
    
    if (this.groupId && this.groupInfo) {
      const teamValid = this.teamData.teamSize > 0 &&
                       this.teamData.teamLeader.trim() !== '' &&
                       this.teamData.leaderContact.trim() !== '' &&
                       this.teamData.leaderEmail.trim() !== '' &&
                       this.teamData.teamMembers.trim() !== '' &&
                       this.teamData.academicYear !== '' &&
                       this.teamData.semester !== '' &&
                       this.teamData.motivation.trim() !== '';
      return basicValid && teamValid;
    }
    
    return basicValid;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.toastService.showError('Please fill all fields and upload required documents', 'Validation Error');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('internshipId', this.internshipId.toString());
    formData.append('college', this.applicationData.college);
    formData.append('degree', this.applicationData.degree);
    formData.append('yearOfStudy', this.applicationData.yearOfStudy);
    
    if (this.groupId) {
      formData.append('groupId', this.groupId.toString());
      formData.append('applicationType', 'GROUP');
      
      // Add team data
      formData.append('teamSize', this.teamData.teamSize.toString());
      formData.append('teamLeader', this.teamData.teamLeader);
      formData.append('leaderContact', this.teamData.leaderContact);
      formData.append('leaderEmail', this.teamData.leaderEmail);
      formData.append('teamMembers', this.teamData.teamMembers);
      formData.append('memberEmails', this.teamData.memberEmails);
      formData.append('academicYear', this.teamData.academicYear);
      formData.append('semester', this.teamData.semester);
      formData.append('skills', this.teamData.skills);
      formData.append('experience', this.teamData.experience);
      formData.append('motivation', this.teamData.motivation);
    } else {
      formData.append('applicationType', 'INDIVIDUAL');
    }

    if (this.applicationData.studentId) {
      formData.append('studentId', this.applicationData.studentId);
    }
    if (this.applicationData.resume) {
      formData.append('resume', this.applicationData.resume);
    }

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

    this.http.post(`${environment.apiUrl}/api/applications`, formData, { headers }).subscribe({
      next: (response) => {
        this.loading = false;
        if (this.groupId) {
          this.toastService.showSuccess('Group application submitted successfully!', 'Success');
          // Update group status to APPLIED
          this.groupService.joinCompany(this.groupId, this.companyId).subscribe();
        } else {
          this.toastService.showSuccess('Application submitted successfully!', 'Success');
        }
        setTimeout(() => {
          this.router.navigate(['/internships'], {
            queryParams: { companyId: this.companyId, companyName: this.companyName }
          });
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.toastService.showError(error.error?.message || 'Failed to submit application', 'Application Error');
      }
    });
  }
}
