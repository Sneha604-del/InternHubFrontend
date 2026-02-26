import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-help-support',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, HttpClientModule],
  template: `
    <div class="container" 
         (touchstart)="onTouchStart($event)" 
         (touchend)="onTouchEnd($event)"
         (mousedown)="onMouseDown($event)"
         (mousemove)="onMouseMove($event)"
         (mouseup)="onMouseUp($event)"
         (wheel)="onWheel($event)">
      
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'faq'"
          (click)="switchTab('faq')">
          <mat-icon>help_outline</mat-icon>
          <span>FAQ</span>
        </button>
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'contact'"
          (click)="switchTab('contact')">
          <mat-icon>mail_outline</mat-icon>
          <span>Contact Us</span>
        </button>
      </div>

      <!-- Swipe Indicator -->
      <div class="swipe-indicator">
        <div class="swipe-dots">
          <div class="dot" [class.active]="activeTab === 'faq'"></div>
          <div class="dot" [class.active]="activeTab === 'contact'"></div>
        </div>
      </div>

      <!-- Content Wrapper with Slide Animation -->
      <div class="slider-wrapper">
        <div class="content-slider" [style.transform]="'translateX(' + getSlideOffset() + '%)'">
          <!-- FAQ Tab -->
          <div class="content-section slide">
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

          <!-- Contact Us Tab -->
          <div class="content-section slide">
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
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
      background: #f8f9fa;
      overflow-x: hidden;
    }

    .tab-navigation {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
      overflow: hidden;
      margin-bottom: 16px;
      display: flex;
    }

    .nav-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px 20px;
      background: white;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #616161;
      transition: all 0.2s;
      border-right: 1px solid #f5f5f5;
    }

    .nav-tab:last-child {
      border-right: none;
    }

    .nav-tab:hover {
      background-color: #f8f9fa;
      color: #007bff;
    }

    .nav-tab.active {
      background: #007bff;
      color: white;
    }

    .nav-tab mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .swipe-indicator {
      text-align: center;
      margin-bottom: 20px;
    }

    .swipe-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #e0e0e0;
      transition: all 0.3s;
    }

    .dot.active {
      background: #007bff;
      transform: scale(1.2);
    }

    .slider-wrapper {
      overflow: hidden;
      width: 100%;
    }

    .content-slider {
      display: flex;
      width: 200%;
      transition: transform 0.3s ease-in-out;
    }

    .content-section {
      width: 50%;
      padding: 0;
      flex-shrink: 0;
    }

    .faq-section {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-bottom: 20px;
    }

    .faq-item {
      border-bottom: 1px solid #ecf0f1;
    }

    .faq-item:last-child {
      border-bottom: none;
    }

    .faq-question {
      width: 100%;
      padding: 16px;
      border: none;
      background: none;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      color: #2c3e50;
      transition: background 0.2s;
    }

    .faq-question:active {
      background: #f8f9fa;
    }

    .arrow {
      font-size: 24px;
      color: #bdc3c7;
      transition: transform 0.3s;
    }

    .arrow.open {
      transform: rotate(90deg);
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s;
    }

    .faq-answer.open {
      max-height: 300px;
    }

    .faq-answer p {
      padding: 0 16px 16px;
      margin: 0;
      color: #7f8c8d;
      font-size: 14px;
      line-height: 1.6;
    }

    .support-links {
      background: white;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .support-links h3 {
      font-size: 16px;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 12px 0;
    }

    .link-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      text-decoration: none;
      color: #2c3e50;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      background: #f8f9fa;
      transition: background 0.2s;
    }

    .link-item:active {
      background: #e9ecef;
    }

    .contact-form {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 15px;
      box-sizing: border-box;
      background: white;
      font-family: inherit;
      transition: all 0.2s;
      user-select: text;
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .submit-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,123,255,0.25);
      transition: all 0.2s;
    }

    .submit-btn:active:not(:disabled) {
      transform: translateY(1px);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .success-msg {
      margin-top: 16px;
      padding: 14px;
      background: #d4edda;
      color: #155724;
      border-radius: 8px;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
    }

    @media (min-width: 768px) {
      .container {
        padding: 24px;
      }

      .nav-tab {
        padding: 12px;
        font-size: 15px;
      }

      .nav-tab:hover {
        background-color: #f8f9fa;
      }

      .faq-question:hover {
        background: #f8f9fa;
      }

      .link-item:hover {
        background: #e9ecef;
      }

      .submit-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, #0056b3, #004085);
      }
    }
  `]
})
export class HelpSupportComponent {
  activeTab: 'faq' | 'contact' = 'faq';
  submitting = false;
  submitSuccess = false;
  private touchStartX = 0;
  private touchEndX = 0;
  private mouseStartX = 0;
  private mouseEndX = 0;
  private isDragging = false;

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

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }
    this.mouseStartX = event.clientX;
    this.isDragging = true;
    document.body.style.userSelect = 'none';
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }
    event.preventDefault();
  }

  onMouseUp(event: MouseEvent) {
    if (!this.isDragging) return;
    this.mouseEndX = event.clientX;
    this.isDragging = false;
    document.body.style.userSelect = '';
    this.handleMouseSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 30;
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && this.activeTab === 'faq') {
        this.switchTab('contact');
      } else if (swipeDistance < 0 && this.activeTab === 'contact') {
        this.switchTab('faq');
      }
    }
  }

  handleMouseSwipe() {
    const swipeThreshold = 30;
    const swipeDistance = this.mouseStartX - this.mouseEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && this.activeTab === 'faq') {
        this.switchTab('contact');
      } else if (swipeDistance < 0 && this.activeTab === 'contact') {
        this.switchTab('faq');
      }
    }
  }

  onWheel(event: WheelEvent) {
    const threshold = 10;
    if (Math.abs(event.deltaX) > threshold) {
      event.preventDefault();
      if (event.deltaX > 0 && this.activeTab === 'faq') {
        this.switchTab('contact');
      } else if (event.deltaX < 0 && this.activeTab === 'contact') {
        this.switchTab('faq');
      }
    }
  }

  getSlideOffset(): number {
    return this.activeTab === 'faq' ? 0 : -50;
  }

  switchTab(tab: 'faq' | 'contact') {
    this.activeTab = tab;
  }

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }

  submitForm() {
    if (!this.contactForm.subject || !this.contactForm.message) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      alert('Please login to submit a support request');
      return;
    }

    this.submitting = true;
    
    const requestData = {
      studentId: currentUser.id,
      subject: this.contactForm.subject,
      message: this.contactForm.message
    };

    this.http.post(`${environment.apiUrl}/api/help-support`, requestData).subscribe({
      next: () => {
        this.submitting = false;
        this.submitSuccess = true;
        this.contactForm = { subject: '', message: '' };
        setTimeout(() => this.submitSuccess = false, 3000);
      },
      error: (error) => {
        console.error('Error submitting support request:', error);
        this.submitting = false;
        alert('Failed to submit request. Please try again.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
