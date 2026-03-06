import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastService } from '../../services/toast.service';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, FileUploadModule, InputNumberModule, CardModule, DividerModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
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

  fileErrors: { studentId: string; resume: string; invitationLetter: string; pastQualification: string } = { studentId: '', resume: '', invitationLetter: '', pastQualification: '' };

  applicationData = {
    college: '',
    degree: '',
    yearOfStudy: '',
    studentId: null as File | null,
    resume: null as File | null,
    invitationLetter: null as File | null,
    pastQualification: null as File | null
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
  invitationFileName = '';
  pastQualificationFileName = '';
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
      console.log('🔵 Group ID from params:', this.groupId);
      
      if (this.internshipId) {
        this.loadInternshipDetails();
      } else {
        console.error('❌ No internship ID found!');
      }
      
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.loadGroupInfo();
        
        if (!this.groupId) {
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
    if (!currentUser?.id) {
      console.log('No current user');
      return;
    }

    // First check if groupId is in URL params
    if (this.groupId) {
      console.log('Loading group by groupId from URL:', this.groupId);
      this.groupService.getGroupById(this.groupId).subscribe({
        next: (group) => {
          console.log('Loaded group data by ID:', group);
          this.groupInfo = group;
          this.prefillGroupData(group, currentUser);
        },
        error: (error) => {
          console.error('Error loading group by ID:', error);
        }
      });
    } else {
      // Fallback: Load user's group
      console.log('No groupId in URL - loading user group');
      this.groupService.getUserGroup(currentUser.id).subscribe({
        next: (group) => {
          console.log('Loaded user group data:', group);
          this.groupInfo = group;
          if (group) {
            this.prefillGroupData(group, currentUser);
          }
        },
        error: (error) => {
          console.error('Error loading user group:', error);
        }
      });
    }
  }

  prefillGroupData(group: any, currentUser: any) {
    this.applicationData.college = group.collegeName || '';
    this.applicationData.degree = group.department || '';
    this.applicationData.yearOfStudy = group.academicYear || '';
    
    this.teamData.teamSize = group.totalStudents || 1;
    this.teamData.academicYear = group.academicYear || '';
    this.teamData.semester = group.semester || '';
    this.teamData.teamLeader = group.leader?.fullName || currentUser.fullName || '';
    this.teamData.leaderEmail = group.leader?.email || currentUser.email || '';
    this.teamData.leaderContact = group.leader?.phone || '';
    
    console.log('Pre-filled application data:', this.applicationData);
    console.log('Pre-filled team data:', this.teamData);
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
      if (file.size > 256 * 1024) {
        this.fileErrors[field as keyof typeof this.fileErrors] = 'File size is too big. Maximum 256KB allowed';
        event.target.value = '';
        return;
      }
      (this.applicationData as any)[field] = file;
      if (field === 'studentId') {
        this.studentIdFileName = file.name;
      } else if (field === 'resume') {
        this.resumeFileName = file.name;
      } else if (field === 'invitationLetter') {
        this.invitationFileName = file.name;
      } else if (field === 'pastQualification') {
        this.pastQualificationFileName = file.name;
      }
    }
  }

  isFormComplete(): boolean {
    const hasBasicInfo = !!(this.applicationData.college && this.applicationData.degree && this.applicationData.yearOfStudy);
    
    if (this.groupInfo) {
      const hasAllDocuments = !!(this.applicationData.studentId && this.applicationData.resume && this.applicationData.invitationLetter);
      const hasTeamInfo = !!(this.teamData.teamSize && this.teamData.teamLeader && 
                            this.teamData.leaderContact && this.teamData.leaderEmail && 
                            this.teamData.teamMembers && this.teamData.academicYear && 
                            this.teamData.semester && this.teamData.motivation);
      return hasAllDocuments && hasBasicInfo && hasTeamInfo;
    } else {
      const hasIndividualDocuments = !!(this.applicationData.resume && this.applicationData.pastQualification);
      const hasIndividualInfo = !!(this.individualData.fullName && this.individualData.email && 
                                   this.individualData.phone && this.individualData.duration && 
                                   this.individualData.motivation);
      return hasIndividualDocuments && hasBasicInfo && hasIndividualInfo;
    }
  }

  onlyNumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  onSubmit() {
    this.submittedOnce = true;

    if (!this.isFormComplete()) {
      let missingField = '';
      
      if (this.groupId) {
        if (!this.applicationData.studentId) missingField = 'Student ID Card';
        else if (!this.applicationData.resume) missingField = 'Resume/CV';
        else if (!this.applicationData.invitationLetter) missingField = 'College Invitation Letter';
      } else {
        if (!this.applicationData.resume) missingField = 'Resume/CV';
        else if (!this.applicationData.pastQualification) missingField = 'Past Qualification Documents';
      }
      
      if (!missingField) {
        if (!this.groupId) {
          if (!this.individualData.fullName) missingField = 'Full Name';
          else if (!this.individualData.email) missingField = 'Email Address';
          else if (!this.individualData.phone) missingField = 'Phone Number';
          else if (this.individualData.phone && !/^\d{10}$/.test(this.individualData.phone)) missingField = 'Valid Phone Number (10 digits)';
          else if (!this.individualData.duration) missingField = 'Preferred Duration';
          else if (!this.individualData.motivation) missingField = 'Why This Internship';
        } else {
          if (!this.teamData.teamSize) missingField = 'Actual Team Size';
          else if (!this.teamData.teamLeader) missingField = 'Team Leader Name';
          else if (!this.teamData.leaderContact) missingField = 'Team Leader Contact';
          else if (this.teamData.leaderContact && !/^\d{10}$/.test(this.teamData.leaderContact)) missingField = 'Valid Team Leader Contact (10 digits)';
          else if (!this.teamData.leaderEmail) missingField = 'Team Leader Email';
          else if (!this.teamData.teamMembers) missingField = 'Team Members Names';
          else if (!this.teamData.academicYear) missingField = 'Academic Year';
          else if (!this.teamData.semester) missingField = 'Current Semester';
          else if (!this.teamData.motivation) missingField = 'Why This Internship';
        }
      }
      
      if (!missingField) {
        if (!this.applicationData.college) missingField = 'College Name';
        else if (!this.applicationData.degree) missingField = 'Degree';
        else if (!this.applicationData.yearOfStudy) missingField = 'Year of Study';
      }
      
      this.toastService.showError(`Please fill: ${missingField}`, 'Missing Field');
      
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
    if (this.applicationData.invitationLetter) {
      formData.append('invitationLetter', this.applicationData.invitationLetter);
    }
    if (this.applicationData.pastQualification) {
      formData.append('pastQualification', this.applicationData.pastQualification);
    }

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

    this.http.post(`${environment.apiUrl}/api/applications`, formData, { headers }).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (this.groupId) {
          this.toastService.showSuccess('Group application submitted successfully!', 'Success');
          this.groupService.joinCompany(this.groupId, this.companyId).subscribe({
            next: () => {
              setTimeout(() => {
                this.router.navigate(['/groups']);
              }, 1500);
            },
            error: (err) => {
              console.error('Error updating group:', err);
              setTimeout(() => {
                this.router.navigate(['/groups']);
              }, 1500);
            }
          });
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
