import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { GroupService } from '../../services/group.service';
import { ToastService } from '../../services/toast.service';
import { Group, GroupMember } from '../../models/group.model';
import { ApiService } from '../../services/api.service';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, 
    InputTextModule, TagModule, ProgressSpinnerModule, DialogModule
  ],
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
  group: Group | null = null;
  members: GroupMember[] = [];
  inviteEmail = '';
  loading = true;
  inviting = false;
  showCompanyDialog = false;
  companies: any[] = [];
  loadingCompanies = false;
  groupReceipts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private toastService: ToastService,
    private apiService: ApiService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const groupId = this.route.snapshot.params['id'];
    if (groupId) {
      this.loadGroupDetails(+groupId);
      this.loadGroupMembers(+groupId);
      this.loadGroupReceipts(+groupId);
    }
  }

  loadGroupDetails(groupId: number): void {
    this.groupService.getGroupById(groupId).subscribe({
      next: (group) => {
        this.group = group;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading group:', error);
        this.loading = false;
      }
    });
  }

  loadGroupMembers(groupId: number): void {
    this.groupService.getGroupMembers(groupId).subscribe({
      next: (members) => {
        this.members = members;
      },
      error: (error) => {
        console.error('Error loading members:', error);
      }
    });
  }

  inviteStudent(): void {
    if (!this.inviteEmail || !this.group?.id) return;
    
    this.inviting = true;
    this.groupService.inviteStudent(this.group.id, this.inviteEmail).subscribe({
      next: (response) => {
        this.inviting = false;
        this.toastService.showSuccess('Invitation sent successfully!', 'Success');
        this.inviteEmail = '';
      },
      error: (error) => {
        this.inviting = false;
        this.toastService.showError('Failed to send invitation', 'Error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/groups']);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'APPLIED': return 'info';
      case 'SELECTED': return 'warn';
      default: return 'secondary';
    }
  }

  openCompanySelection(): void {
    this.showCompanyDialog = true;
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loadingCompanies = true;
    this.apiService.getAllCompanies().subscribe({
      next: (response) => {
        this.companies = response.data || response;
        this.loadingCompanies = false;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.loadingCompanies = false;
        this.toastService.showError('Failed to load companies', 'Error');
      }
    });
  }

  selectCompany(company: any): void {
    this.showCompanyDialog = false;
    // Navigate to company internships page
    this.router.navigate(['/company-internships'], {
      queryParams: {
        companyId: company.id,
        companyName: company.name,
        groupId: this.group?.id
      }
    });
  }
  
  loadGroupReceipts(groupId: number): void {
    console.log('Loading receipts for group:', groupId);
    this.paymentService.getReceiptsByGroupId(groupId).subscribe({
      next: (receipts) => {
        console.log('Receipts loaded:', receipts);
        this.groupReceipts = receipts;
      },
      error: (error) => {
        console.error('Error loading receipts:', error);
      }
    });
  }
  
  viewReceipt(receipt: any): void {
    const receiptWindow = window.open('', '_blank', 'width=600,height=800');
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt - ${receipt.receiptNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
              .receipt { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #1976d2; padding-bottom: 20px; margin-bottom: 20px; }
              .header h1 { color: #1976d2; margin: 0; }
              .receipt-number { font-size: 14px; color: #666; margin-top: 5px; }
              .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .label { font-weight: 600; color: #333; }
              .value { color: #666; }
              .amount { font-size: 24px; color: #4caf50; font-weight: bold; text-align: center; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; color: #999; font-size: 12px; }
              @media print { body { background: white; } .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h1>Payment Receipt</h1>
                <div class="receipt-number">Receipt #${receipt.receiptNumber}</div>
              </div>
              <div class="row"><span class="label">Payment ID:</span><span class="value">${receipt.paymentId}</span></div>
              <div class="row"><span class="label">Date:</span><span class="value">${new Date(receipt.paymentDate).toLocaleString()}</span></div>
              <div class="row"><span class="label">Company:</span><span class="value">${receipt.companyName}</span></div>
              <div class="row"><span class="label">Internship:</span><span class="value">${receipt.internshipTitle}</span></div>
              <div class="row"><span class="label">Application Type:</span><span class="value">${receipt.applicationType}</span></div>
              <div class="row"><span class="label">Payment Method:</span><span class="value">${receipt.paymentMethod}</span></div>
              <div class="amount">₹${receipt.amount.toFixed(2)}</div>
              <div class="footer">
                <p>Thank you for your payment!</p>
                <p>This is a computer-generated receipt.</p>
                <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Print Receipt</button>
              </div>
            </div>
          </body>
        </html>
      `);
      receiptWindow.document.close();
    }
  }
}