import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegistrationRequest } from '../../models/student.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.registrationData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.registrationData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.register(this.registrationData).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = error.error || error.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}