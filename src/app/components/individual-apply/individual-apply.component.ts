import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-individual-apply',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, DividerModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './individual-apply.component.html',
  styleUrls: ['./individual-apply.component.css']
})
export class IndividualApplyComponent implements OnInit {
  internshipId: number = 0;
  companyId: number = 0;
  companyName: string = '';
  loading = false;

  individualData = {
    fullName: '',
    email: '',
    phone: '',
    duration: '',
    skills: '',
    motivation: '',
    college: '',
    degree: '',
    yearOfStudy: '',
    resume: null as File | null,
    pastQualification: null as File | null
  };

  resumeFileName = '';
  pastQualificationFileName = '';
  fileErrors = { resume: '', pastQualification: '' };
  applicationFee = 0;
  requiresPayment = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService,
    private authService: AuthService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.internshipId = +params['internshipId'];
      this.companyId = +params['companyId'];
      this.companyName = params['companyName'] || '';
      
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.individualData.fullName = currentUser.fullName || '';
        this.individualData.email = currentUser.email || '';
      }
      
      if (this.internshipId) {
        this.loadInternshipDetails();
      }
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

  onFileSelect(event: any, field: 'resume' | 'pastQualification') {
    const file = event.target.files[0];
    this.fileErrors[field] = '';
    
    if (file) {
      if (file.size > 256 * 1024) {
        this.fileErrors[field] = 'File size too big. Max 256KB';
        event.target.value = '';
        return;
      }
      this.individualData[field] = file;
      if (field === 'resume') this.resumeFileName = file.name;
      else this.pastQualificationFileName = file.name;
    }
  }

  onlyNumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  onSubmit() {
    if (!this.individualData.resume || !this.individualData.pastQualification) {
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
        orderData.userName = this.individualData.fullName;
        orderData.userEmail = this.individualData.email;
        orderData.userPhone = this.individualData.phone;
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
    formData.append('applicationType', 'INDIVIDUAL');
    formData.append('fullName', this.individualData.fullName);
    formData.append('email', this.individualData.email);
    formData.append('phone', this.individualData.phone);
    formData.append('duration', this.individualData.duration);
    formData.append('skills', this.individualData.skills);
    formData.append('motivation', this.individualData.motivation);
    formData.append('college', this.individualData.college);
    formData.append('degree', this.individualData.degree);
    formData.append('yearOfStudy', this.individualData.yearOfStudy);
    
    if (this.individualData.resume) formData.append('resume', this.individualData.resume);
    if (this.individualData.pastQualification) formData.append('pastQualification', this.individualData.pastQualification);
    
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

    this.http.post(`${environment.apiUrl}/api/applications/individual`, formData, { headers }).subscribe({
      next: (response: any) => {
        // If payment was made, verify and create receipt
        if (paymentId && orderId && response.id) {
          this.verifyPaymentAndCreateReceipt(paymentId, orderId, response.id);
        } else {
          this.loading = false;
          this.toastService.showSuccess('Application submitted successfully!', 'Success');
          setTimeout(() => this.router.navigate(['/home'], { queryParams: { tab: 'docs' } }), 2000);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Application submission error:', error);
        console.error('Error details:', error.error);
        this.toastService.showError(error.error?.message || error.error || 'Failed to submit', 'Error');
      }
    });
  }
  
  verifyPaymentAndCreateReceipt(paymentId: string, orderId: string, applicationId: number) {
    const paymentData = {
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      applicationId: applicationId.toString(),
      amount: (this.applicationFee * 100).toString()
    };
    
    this.paymentService.verifyPayment(paymentData).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Application submitted and payment receipt generated!', 'Success');
        setTimeout(() => this.router.navigate(['/home'], { queryParams: { tab: 'docs' } }), 2000);
      },
      error: (error) => {
        this.loading = false;
        this.toastService.showWarning('Application submitted but receipt generation failed', 'Warning');
        setTimeout(() => this.router.navigate(['/home'], { queryParams: { tab: 'docs' } }), 2000);
      }
    });
  }
}
