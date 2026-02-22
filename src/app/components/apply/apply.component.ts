import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastService } from '../../services/toast.service';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, FileUploadModule, InputNumberModule],
  template: `
    <div class="group-details-container">
      <div class="header">
        <h2>{{groupInfo ? 'Group Application' : 'Individual Application'}}</h2>
      </div>

      <form (ngSubmit)="onSubmit()" #applyForm="ngForm" class="content">
        <div *ngIf="!groupInfo">
          <h3 class="section-highlight">Personal Information</h3>
          <div class="info-grid">
            <div class="field">
              <label for="fullName">Full Name *</label>
              <input pInputText id="fullName" [(ngModel)]="individualData.fullName" name="fullName" 
                     required [class.error-field]="isFieldInvalid('fullName')" />
            </div>
            <div class="field">
              <label for="email">Email Address *</label>
              <input pInputText id="email" type="email" [(ngModel)]="individualData.email" name="email" 
                     required [class.error-field]="isFieldInvalid('email')" />
            </div>
            <div class="field">
              <label for="phone">Phone Number *</label>
              <input pInputText id="phone" [(ngModel)]="individualData.phone" name="phone" 
                     required [class.error-field]="isFieldInvalid('phone')" />
            </div>
            <div class="field">
              <label for="duration">Preferred Duration (Months) *</label>
              <select id="duration" [(ngModel)]="individualData.duration" name="duration" 
                      required [class.error-field]="isFieldInvalid('duration')">
                <option value="">Select duration</option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
                <option value="6">6 Months</option>
              </select>
            </div>
          </div>

          <h3>Skills & Expertise</h3>
          <div class="faculty-info">
            <textarea [(ngModel)]="individualData.skills" name="individualSkills" rows="3"></textarea>
          </div>

          <h3>Why This Internship? *</h3>
          <div class="faculty-info">
            <textarea [(ngModel)]="individualData.motivation" name="individualMotivation" 
                      required rows="4" [class.error-field]="isFieldInvalid('individualMotivation')"></textarea>
          </div>
        </div>

        <div *ngIf="groupInfo">
          <h3 class="section-title">Group Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Group Name:</strong> {{groupInfo.groupName}}
            </div>
            <div class="info-item">
              <strong>College:</strong> {{groupInfo.collegeName}}
            </div>
            <div class="info-item">
              <strong>Department:</strong> {{groupInfo.department}}
            </div>
            <div class="info-item">
              <strong>Total Students:</strong> {{groupInfo.totalStudents}}
            </div>
          </div>

          <h3>Team Details</h3>
          <div class="info-grid">
            <div class="field">
              <label for="teamSize">Actual Team Size *</label>
              <p-inputNumber id="teamSize" [(ngModel)]="teamData.teamSize" name="teamSize" 
                             [required]="true" [class.error-field]="isFieldInvalid('teamSize')"></p-inputNumber>
            </div>
            <div class="field">
              <label for="teamLeader">Team Leader Name *</label>
              <input pInputText id="teamLeader" [(ngModel)]="teamData.teamLeader" name="teamLeader" 
                     required [class.error-field]="isFieldInvalid('teamLeader')" />
            </div>
            <div class="field">
              <label for="leaderContact">Team Leader Contact *</label>
              <input pInputText id="leaderContact" [(ngModel)]="teamData.leaderContact" name="leaderContact" 
                     required [class.error-field]="isFieldInvalid('leaderContact')" />
            </div>
            <div class="field">
              <label for="leaderEmail">Team Leader Email *</label>
              <input pInputText id="leaderEmail" type="email" [(ngModel)]="teamData.leaderEmail" name="leaderEmail" 
                     required [class.error-field]="isFieldInvalid('leaderEmail')" />
            </div>
          </div>

          <h3>Team Members (Names) *</h3>
          <div class="faculty-info">
            <textarea [(ngModel)]="teamData.teamMembers" name="teamMembers" 
                      required rows="4" [class.error-field]="isFieldInvalid('teamMembers')"></textarea>
          </div>

          <h3>Team Member Emails</h3>
          <div class="faculty-info">
            <textarea [(ngModel)]="teamData.memberEmails" name="memberEmails" rows="3"></textarea>
          </div>

          <h3>Academic Year *</h3>
          <div class="info-grid">
            <div class="field">
              <select [(ngModel)]="teamData.academicYear" name="academicYear" 
                      required [class.error-field]="isFieldInvalid('academicYear')">
                <option value="">Select academic year</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>
            <div class="field">
              <label>Current Semester *</label>
              <select [(ngModel)]="teamData.semester" name="semester" 
                      required [class.error-field]="isFieldInvalid('semester')">
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
          </div>

          <h3>Team Skills & Expertise</h3>
          <div class="faculty-info">
            <textarea [(ngModel)]="teamData.skills" name="skills" rows="3"></textarea>
          </div>

          <h3>Previous Project Experience</h3>
          <div class="faculty-info">
            <textarea [(ngModel)]="teamData.experience" name="experience" rows="3"></textarea>
          </div>

          <h3>Why This Internship? *</h3>
          <div class="faculty-info">
            <textarea [(ngModel)]="teamData.motivation" name="motivation" 
                      required rows="4" [class.error-field]="isFieldInvalid('motivation')"></textarea>
          </div>
        </div>

        <h3 class="section-highlight">Educational Information</h3>
        <div class="info-grid">
          <div class="field">
            <label for="college">Name of your college *</label>
            <input pInputText id="college" [(ngModel)]="applicationData.college" name="college" 
                   required [class.error-field]="isFieldInvalid('college')" />
          </div>
          <div class="field">
            <label for="degree">Degree you are studying *</label>
            <input pInputText id="degree" [(ngModel)]="applicationData.degree" name="degree" 
                   required [class.error-field]="isFieldInvalid('degree')" />
          </div>
          <div class="field">
            <label for="yearOfStudy">Year of study *</label>
            <select id="yearOfStudy" [(ngModel)]="applicationData.yearOfStudy" name="yearOfStudy" 
                    required [class.error-field]="isFieldInvalid('yearOfStudy')">
              <option value="">Select year</option>
              <option value="1st year">1st year</option>
              <option value="2nd year">2nd year</option>
              <option value="3rd year">3rd year</option>
              <option value="4th year">4th year</option>
              <option value="5th year">5th year</option>
            </select>
          </div>
        </div>

        <h3 class="section-highlight">Documents for Verification</h3>
        <div class="info-grid">
          <div class="field">
            <label>{{groupInfo ? 'Group Leader\'s Student ID card' : 'Student ID card'}}</label>
            <input #studentIdInput type="file" (change)="onFileSelect($event, 'studentId')" 
                   accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
            <p-button (onClick)="studentIdInput.click()" [label]="studentIdFileName || 'Choose File'" 
                      icon="pi pi-upload" styleClass="w-full p-button-outlined"></p-button>
            <small class="file-hint">Upload PDF, JPG, or PNG (Max 5MB)</small>
            <small class="error-msg" *ngIf="fileErrors.studentId">{{fileErrors.studentId}}</small>
          </div>
          <div class="field">
            <label>{{groupInfo ? 'Group Resume/Portfolio' : 'Resume/CV'}}</label>
            <input #resumeInput type="file" (change)="onFileSelect($event, 'resume')" 
                   accept=".pdf" style="display: none;">
            <p-button (onClick)="resumeInput.click()" [label]="resumeFileName || 'Choose File'" 
                      icon="pi pi-upload" styleClass="w-full p-button-outlined"></p-button>
            <small class="file-hint">Upload PDF only (Max 5MB)</small>
            <small class="error-msg" *ngIf="fileErrors.resume">{{fileErrors.resume}}</small>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <button type="submit" class="submit-btn" [class.btn-success]="applyForm.valid && !loading" 
                  [disabled]="loading || !applyForm.valid">
            <i class="pi pi-check" style="margin-right: 8px;"></i>
            {{loading ? 'Processing...' : (groupInfo ? 'Submit Group Application' : 'Apply Now')}}
          </button>
        </div>
      </form>


    </div>
  `,
  styles: [`
    .group-details-container {
      max-width: 1000px;
      margin: 20px auto;
      padding: 20px;
    }

    .header {
      margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 16px;
      border-radius: 8px;
    }

    .header h2 {
      color: white;
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .content {
      padding: 32px;
    }

    .section-title {
      color: #1a202c;
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 20px 0 !important;
      padding: 0 !important;
      border: none !important;
    }

    .content h3 {
      margin: 2rem 0 1rem 0;
      color: #1a202c;
      font-size: 18px;
      font-weight: 600;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .content h3:first-of-type {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .info-item {
      font-size: 14px;
    }

    .field {
      margin-bottom: 16px;
    }

    .field label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .faculty-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    input, select, textarea {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #cbd5e1;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.2s ease;
      background: white;
      color: #1f2937;
      font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      outline: none;
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }

    .error-field {
      border: 2px solid #dc2626 !important;
      background-color: #fee2e2 !important;
    }

    .file-hint {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      color: #666;
      font-style: italic;
    }

    .error-msg {
      display: block;
      margin-top: 4px;
      font-size: 12px;
      color: #dc2626;
      font-weight: 500;
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .submit-btn.btn-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .submit-btn.btn-success:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }

    ::ng-deep .p-inputtext {
      border: 2px solid #cbd5e1 !important;
    }

    ::ng-deep .p-button-outlined {
      border: 2px solid #667eea;
      color: #667eea;
      background: white;
    }

    ::ng-deep .p-button-outlined:hover {
      background: #667eea;
      color: white;
    }

    .group-details-container {
      max-width: 100%;
      margin: 0;
      padding: 12px;
    }

    .header {
      margin-bottom: 20px;
    }

    .header h2 {
      font-size: 18px;
    }

    .content {
      padding: 16px;
    }

    .section-title {
      font-size: 16px;
      margin: 0 0 16px 0;
    }

    .content h3 {
      margin: 1.5rem 0 0.8rem 0;
      font-size: 15px;
      padding-top: 1rem;
    }

    .section-highlight {
      color: #667eea;
      font-size: 15px;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      padding: 0 0 8px 0;
      border-bottom: 3px solid #667eea;
    }

    .info-grid {
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }

    .field {
      margin-bottom: 12px;
    }

    .field label {
      font-size: 13px;
      margin-bottom: 6px;
    }

    input, select, textarea {
      padding: 10px 12px;
      font-size: 14px;
    }

    textarea {
      min-height: 70px;
    }

    .submit-btn {
      height: 44px;
      font-size: 14px;
    }

    .file-hint {
      font-size: 11px;
    }

    .error-msg {
      font-size: 11px;
    }
  `]
})
export class ApplyComponent implements OnInit {
  @ViewChild('applyForm') applyForm!: NgForm;

  internshipId: number = 0;
  companyId: number = 0;
  companyName: string = '';
  groupId: number = 0;
  groupInfo: any = null;
  loading = false;
  submittedOnce = false;

  fileErrors: { studentId: string; resume: string } = { studentId: '', resume: '' };

  applicationData = {
    college: '',
    degree: '',
    yearOfStudy: '',
    studentId: null as File | null,
    resume: null as File | null
  };

  individualData = {
    fullName: '',
    email: '',
    phone: '',
    duration: '',
    skills: '',
    motivation: ''
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
  applicationFee = 0;
  requiresPayment = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService,
    private groupService: GroupService,
    private authService: AuthService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.internshipId = +params['internshipId'];
      this.companyId = +params['companyId'];
      this.companyName = params['companyName'] || '';
      this.groupId = +params['groupId'];
      
      console.log('🔵 Internship ID:', this.internshipId);
      
      if (this.internshipId) {
        this.loadInternshipDetails();
      } else {
        console.error('❌ No internship ID found!');
      }
      
      if (this.groupId) {
        this.loadGroupInfo();
      } else {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.individualData.fullName = currentUser.fullName || '';
          this.individualData.email = currentUser.email || '';
        }
      }
    });
  }

  loadInternshipDetails() {
    this.http.get(`${environment.apiUrl}/api/internships/${this.internshipId}`).subscribe({
      next: (internship: any) => {
        this.applicationFee = internship.applicationFee || 0;
        this.requiresPayment = internship.requiresPayment || false;
        console.log('✅ Internship loaded:', { applicationFee: this.applicationFee, requiresPayment: this.requiresPayment });
      },
      error: (error) => {
        console.error('❌ Error loading internship details:', error);
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

  isFieldInvalid(fieldName: string): boolean {
    if (!this.submittedOnce) return false;
    const field = this.applyForm?.form?.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  onFileSelect(event: any, field: string) {
    const file = event.target.files[0];
    this.fileErrors[field as keyof typeof this.fileErrors] = '';
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.fileErrors[field as keyof typeof this.fileErrors] = 'File size is too big. Maximum 5MB allowed';
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

  onSubmit() {
    this.submittedOnce = true;

    if (!this.applyForm.valid) {
      this.toastService.showError('Please fill all required fields', 'Validation Error');
      
      setTimeout(() => {
        const invalidField = document.querySelector('.error-field');
        if (invalidField) {
          invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    console.log('🔍 Checking payment:', { requiresPayment: this.requiresPayment, applicationFee: this.applicationFee });
    
    if (this.requiresPayment && this.applicationFee > 0) {
      console.log('💳 Initiating payment directly');
      this.initiatePayment();
    } else {
      console.log('✅ Submitting without payment');
      this.submitApplication();
    }
  }

  initiatePayment() {
    console.log('🔵 Initiating payment...');
    this.loading = true;

    this.paymentService.createOrder(this.applicationFee).subscribe({
      next: (orderData) => {
        console.log('✅ Order created:', orderData);
        const currentUser = this.authService.getCurrentUser();
        orderData.userName = this.groupId ? this.teamData.teamLeader : this.individualData.fullName;
        orderData.userEmail = this.groupId ? this.teamData.leaderEmail : this.individualData.email;
        orderData.userPhone = this.groupId ? this.teamData.leaderContact : this.individualData.phone;

        console.log('🔵 Opening Razorpay window...');
        this.paymentService.openRazorpay(
          orderData,
          (response) => this.handlePaymentSuccess(response),
          (error) => this.handlePaymentFailure(error)
        );
      },
      error: (error) => {
        console.error('❌ Order creation failed:', error);
        this.loading = false;
        this.toastService.showError('Failed to initiate payment', 'Payment Error');
      }
    });
  }

  handlePaymentSuccess(response: any) {
    console.log('✅ Payment completed, submitting application...');
    console.log('Payment response:', response);
    this.submitApplication(response.razorpay_payment_id);
  }

  handlePaymentFailure(error: any) {
    this.loading = false;
    this.toastService.showError(error.message || 'Payment failed', 'Payment Error');
  }

  submitApplication(paymentId?: string) {

    const formData = new FormData();
    formData.append('internshipId', this.internshipId.toString());
    formData.append('college', this.applicationData.college);
    formData.append('degree', this.applicationData.degree);
    formData.append('yearOfStudy', this.applicationData.yearOfStudy);
    
    // Add payment info
    if (this.requiresPayment && this.applicationFee > 0) {
      formData.append('paymentStatus', 'PAID');
      formData.append('paymentAmount', this.applicationFee.toString());
      if (paymentId) {
        formData.append('paymentId', paymentId);
      }
    } else {
      formData.append('paymentStatus', 'NOT_REQUIRED');
      formData.append('paymentAmount', '0');
    }
    
    if (this.groupId) {
      formData.append('groupId', this.groupId.toString());
      formData.append('applicationType', 'GROUP');
      
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
      
      formData.append('fullName', this.individualData.fullName);
      formData.append('email', this.individualData.email);
      formData.append('phone', this.individualData.phone);
      formData.append('duration', this.individualData.duration);
      formData.append('skills', this.individualData.skills);
      formData.append('motivation', this.individualData.motivation);
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
      next: (response: any) => {
        this.loading = false;
        if (this.groupId) {
          this.toastService.showSuccess('Group application submitted successfully!', 'Success');
          this.groupService.joinCompany(this.groupId, this.companyId).subscribe();
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        } else {
          this.toastService.showSuccess('Application submitted successfully!', 'Success');
          setTimeout(() => {
            this.router.navigate(['/home'], { queryParams: { tab: 'docs' } });
          }, 2000);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Submission error:', error);
        this.toastService.showError(error.error?.message || 'Failed to submit application', 'Application Error');
      }
    });
  }
}
