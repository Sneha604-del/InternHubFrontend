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
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatOptionModule],
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onSubmit(): void {
    if (this.registrationData.password !== this.confirmPassword) {
      this.toastService.showError('Passwords do not match', 'Validation Error');
      return;
    }

    if (this.registrationData.password.length < 6) {
      this.toastService.showError('Password must be at least 6 characters long', 'Validation Error');
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