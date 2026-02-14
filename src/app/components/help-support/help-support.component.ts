import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="tabs">
        <button [class.active]="activeTab === 'faq'" (click)="activeTab = 'faq'">FAQ</button>
        <button [class.active]="activeTab === 'contact'" (click)="activeTab = 'contact'">Contact Us</button>
      </div>

      <div *ngIf="activeTab === 'faq'" class="content">
        <div class="faq-section">
          <div class="faq-item" *ngFor="let faq of faqs; let i = index">
            <button class="faq-question" (click)="toggleFaq(i)">
              <span>{{ faq.question }}</span>
              <span class="arrow" [class.open]="faq.open">›</span>
            </button>
            <div class="faq-answer" [class.open]="faq.open">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>

        <div class="support-links">
          <h3>Quick Links</h3>
          <a href="mailto:support@internhub.com" class="link-item">
            <span>📧</span>
            <span>Email Support</span>
          </a>
          <a href="tel:+1234567890" class="link-item">
            <span>📞</span>
            <span>Call Support</span>
          </a>
        </div>
      </div>

      <div *ngIf="activeTab === 'contact'" class="content">
        <form (ngSubmit)="submitForm()" class="contact-form">
          <div class="form-group">
            <label>Subject</label>
            <input type="text" [(ngModel)]="contactForm.subject" name="subject" required>
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea [(ngModel)]="contactForm.message" name="message" rows="6" required></textarea>
          </div>
          <button type="submit" class="submit-btn" [disabled]="submitting">
            {{ submitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>

        <div *ngIf="submitSuccess" class="success-msg">
          ✓ Your message has been sent successfully!
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 0 auto; padding: 16px; min-height: 100vh; background: #f8f9fa; }
    .tabs { display: flex; gap: 8px; margin-bottom: 20px; background: white; padding: 4px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .tabs button { flex: 1; padding: 10px; border: none; background: none; border-radius: 8px; font-size: 14px; font-weight: 600; color: #7f8c8d; cursor: pointer; transition: all 0.2s; }
    .tabs button.active { background: #007bff; color: white; }

    .content { animation: fadeIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .faq-section { background: transparent; border-radius: 0; overflow: hidden; box-shadow: none; margin-bottom: 20px; }
    .faq-item { border-bottom: 1px solid #ecf0f1; }
    .faq-item:last-child { border-bottom: none; }
    .faq-question { width: 100%; padding: 16px; border: none; background: none; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 15px; font-weight: 600; color: #2c3e50; }
    .faq-question:active { background: #f8f9fa; }
    .arrow { font-size: 24px; color: #bdc3c7; transition: transform 0.3s; }
    .arrow.open { transform: rotate(90deg); }
    .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s; }
    .faq-answer.open { max-height: 300px; }
    .faq-answer p { padding: 0 16px 16px; margin: 0; color: #7f8c8d; font-size: 14px; line-height: 1.6; }

    .support-links { background: transparent; border-radius: 0; padding: 16px 0; box-shadow: none; }
    .support-links h3 { font-size: 16px; font-weight: 700; color: #2c3e50; margin: 0 0 12px 0; }
    .link-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; text-decoration: none; color: #2c3e50; font-size: 14px; font-weight: 500; margin-bottom: 8px; background: #f8f9fa; }
    .link-item:active { background: #e9ecef; }

    .contact-form { background: transparent; border-radius: 0; padding: 20px 0; box-shadow: none; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 14px; font-weight: 600; color: #2c3e50; margin-bottom: 8px; }
    .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; box-sizing: border-box; background: #f8f9fa; font-family: inherit; }
    .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #007bff; background: white; }
    .submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #007bff, #0056b3); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 10px rgba(0,123,255,0.25); }
    .submit-btn:active:not(:disabled) { transform: translateY(1px); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .success-msg { margin-top: 16px; padding: 14px; background: #d4edda; color: #155724; border-radius: 8px; text-align: center; font-size: 14px; font-weight: 600; }

    @media (min-width: 768px) {
      .container { padding: 24px; }
      .tabs button { padding: 12px; font-size: 15px; }
      .faq-question { padding: 18px; font-size: 16px; }
      .faq-question:hover { background: #f8f9fa; }
      .faq-answer p { padding: 0 18px 18px; }
      .link-item:hover { background: #e9ecef; }
      .submit-btn:hover:not(:disabled) { background: linear-gradient(135deg, #0056b3, #004085); }
    }
  `]
})
export class HelpSupportComponent {
  activeTab = 'faq';
  submitting = false;
  submitSuccess = false;
  
  contactForm = {
    subject: '',
    message: ''
  };

  faqs = [
    {
      question: 'How do I apply for an internship?',
      answer: 'Browse available internships on the home page, click on the one you\'re interested in, and click the "Apply" button. Fill in the required details and submit your application.',
      open: false
    },
    {
      question: 'Can I apply for multiple internships?',
      answer: 'Yes, you can apply for as many internships as you like. Each application is tracked separately in your profile.',
      open: false
    },
    {
      question: 'How do I track my application status?',
      answer: 'Go to your profile and check the "My Applications" section. You\'ll see the status of all your applications there.',
      open: false
    },
    {
      question: 'What documents do I need to apply?',
      answer: 'Typically, you\'ll need your resume, student ID, and any other documents specified in the internship posting.',
      open: false
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your registered email.',
      open: false
    },
    {
      question: 'How can I update my profile information?',
      answer: 'Go to your profile page and click on "Edit Profile" to update your information.',
      open: false
    }
  ];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/profile']);
  }

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }

  submitForm() {
    if (!this.contactForm.subject || !this.contactForm.message) return;
    
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.submitSuccess = true;
      this.contactForm = { subject: '', message: '' };
      setTimeout(() => this.submitSuccess = false, 3000);
    }, 1500);
  }
}
