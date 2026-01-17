import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { RegistrationRequest } from '../../models/student.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatOptionModule, MatCheckboxModule, DialogModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationData: RegistrationRequest = {
    fullName: '',
    email: '',
    password: '',
    birthDate: '',
    gender: 'MALE',
    college: '',
    course: ''
  };
  
  confirmPassword = '';
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  passwordErrors: string[] = [];
  acceptTerms = false;
  showTermsDialog = false;
  showPrivacyDialog = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  validatePassword(password: string): boolean {
    this.passwordErrors = [];
    
    if (password.length < 8) {
      this.passwordErrors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      this.passwordErrors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      this.passwordErrors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      this.passwordErrors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      this.passwordErrors.push('Password must contain at least one special character');
    }
    
    return this.passwordErrors.length === 0;
  }

  onPasswordChange(): void {
    this.validatePassword(this.registrationData.password);
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.registrationData.password);
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.registrationData.password);
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.registrationData.password);
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.registrationData.password);
  }

  openTermsDialog(): void {
    this.showTermsDialog = true;
  }

  openPrivacyDialog(): void {
    this.showPrivacyDialog = true;
  }

  onSubmit(): void {
    if (!this.acceptTerms) {
      this.toastService.showError('Please accept the terms and conditions', 'Validation Error');
      return;
    }

    if (!this.validatePassword(this.registrationData.password)) {
      this.toastService.showError(this.passwordErrors.join('. '), 'Password Validation Error');
      return;
    }

    if (this.registrationData.password !== this.confirmPassword) {
      this.toastService.showError('Passwords do not match', 'Validation Error');
      return;
    }

    this.loading = true;
    
    this.authService.register(this.registrationData).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Registration successful! Redirecting to login...', 'Success');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.loading = false;
        this.toastService.showError(error.error || error.message || 'Registration failed', 'Registration Error');
      }
    });
  }
}