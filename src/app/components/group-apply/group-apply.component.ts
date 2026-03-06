import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastService } from '../../services/toast.service';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-group-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, InputNumberModule, CardModule, DividerModule],
  templateUrl: './group-apply.component.html',
  styleUrls: ['./group-apply.component.css']
})
export class GroupApplyComponent implements OnInit {
  internshipId: number = 0;
  companyId: number = 0;
  groupId: number = 0;
  groupInfo: any = null;
  loading = false;

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
    motivation: '',
    college: '',
    degree: '',
    yearOfStudy: '',
    studentId: null as File | null,
    resume: null as File | null,
    invitationLetter: null as File | null
  };

  studentIdFileName = '';
  resumeFileName = '';
  invitationFileName = '';
  fileErrors = { studentId: '', resume: '', invitationLetter: '' };
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
      this.groupId = +params['groupId'];
      
      if (this.internshipId) this.loadInternshipDetails();
      if (this.groupId) this.loadGroupInfo();
    });
  }

  loadInternshipDetails() {
    this.http.get(`${environment.apiUrl}/api/internships/${this.internshipId}`).subscribe({
      next: (internship: any) => {
        this.applicationFee = internship.applicationFee || 0;
        this.requiresPayment = internship.requiresPayment || false;
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
            this.teamData.college = group.collegeName || '';
            this.teamData.degree = group.department || '';
            this.teamData.yearOfStudy = group.academicYear || '';
            this.teamData.teamSize = group.totalStudents || 1;
            this.teamData.academicYear = group.academicYear || '';
            this.teamData.semester = group.semester || '';
            this.teamData.teamLeader = group.leader?.fullName || currentUser.fullName || '';
            this.teamData.leaderEmail = group.leader?.email || currentUser.email || '';
            this.teamData.leaderContact = group.leader?.phone || '';
          }
        }
      });
    }
  }

  onFileSelect(event: any, field: 'studentId' | 'resume' | 'invitationLetter') {
    const file = event.target.files[0];
    this.fileErrors[field] = '';
    
    if (file) {
      if (file.size > 256 * 1024) {
        this.fileErrors[field] = 'File size too big. Max 256KB';
        event.target.value = '';
        return;
      }
      this.teamData[field] = file;
      if (field === 'studentId') this.studentIdFileName = file.name;
      else if (field === 'resume') this.resumeFileName = file.name;
      else this.invitationFileName = file.name;
    }
  }

  onlyNumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  onSubmit() {
    if (!this.teamData.studentId || !this.teamData.resume || !this.teamData.invitationLetter) {
      this.toastService.showError('Please upload all required documents', 'Missing Documents');
      return;
    }

    if (this.requiresPayment && this.applicationFee > 0) {
      this.initiatePayment();
    } else {
      this.submitApplication();
    }
  }

  initiatePayment() {
    this.loading = true;
    this.paymentService.createOrder(this.applicationFee).subscribe({
      next: (orderData) => {
        orderData.userName = this.teamData.teamLeader;
        orderData.userEmail = this.teamData.leaderEmail;
        orderData.userPhone = this.teamData.leaderContact;
        this.paymentService.openRazorpay(
          orderData,
          (response) => this.submitApplication(response.razorpay_payment_id, orderData.orderId),
          (error) => {
            this.loading = false;
            this.toastService.showError(error.message || 'Payment failed', 'Error');
          }
        );
      },
      error: () => {
        this.loading = false;
        this.toastService.showError('Failed to initiate payment', 'Error');
      }
    });
  }

  submitApplication(paymentId?: string, orderId?: string) {
    this.loading = true;
    const formData = new FormData();
    
    formData.append('internshipId', this.internshipId.toString());
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
    formData.append('college', this.teamData.college);
    formData.append('degree', this.teamData.degree);
    formData.append('yearOfStudy', this.teamData.yearOfStudy);
    
    if (this.teamData.studentId) formData.append('studentId', this.teamData.studentId);
    if (this.teamData.resume) formData.append('resume', this.teamData.resume);
    if (this.teamData.invitationLetter) formData.append('invitationLetter', this.teamData.invitationLetter);
    
    if (this.requiresPayment && this.applicationFee > 0) {
      formData.append('paymentStatus', 'COMPLETED');
      formData.append('paymentAmount', this.applicationFee.toString());
      if (paymentId) formData.append('paymentId', paymentId);
    } else {
      formData.append('paymentStatus', 'NOT_REQUIRED');
      formData.append('paymentAmount', '0');
    }

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

    this.http.post(`${environment.apiUrl}/api/applications/group`, formData, { headers }).subscribe({
      next: (response: any) => {
        // If payment was made, verify and create receipt
        if (paymentId && orderId && response.id) {
          this.verifyPaymentAndCreateReceipt(paymentId, orderId, response.id);
        } else {
          this.completeSubmission();
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastService.showError(error.error?.message || 'Failed to submit', 'Error');
      }
    });
  }
  
  verifyPaymentAndCreateReceipt(paymentId: string, orderId: string, applicationId: number) {
    console.log('🔵 Verifying payment and creating receipt for application:', applicationId);
    const paymentData = {
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      applicationId: applicationId.toString(),
      amount: (this.applicationFee * 100).toString()
    };
    
    this.paymentService.verifyPayment(paymentData).subscribe({
      next: (response) => {
        console.log('✅ Receipt created:', response);
        this.toastService.showSuccess('Application submitted and payment receipt generated!', 'Success');
        this.completeSubmission();
      },
      error: (error) => {
        console.error('❌ Receipt creation failed:', error);
        this.toastService.showWarning('Application submitted but receipt generation failed', 'Warning');
        this.completeSubmission();
      }
    });
  }
  
  completeSubmission() {
    this.loading = false;
    this.groupService.joinCompany(this.groupId, this.companyId).subscribe({
      next: () => setTimeout(() => this.router.navigate(['/groups']), 1500),
      error: () => setTimeout(() => this.router.navigate(['/groups']), 1500)
    });
  }
}
