import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoginRequest } from '../../models/student.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    // Trim whitespace from inputs
    this.loginData.email = this.loginData.email?.trim() || '';
    this.loginData.password = this.loginData.password?.trim() || '';
    
    console.log('=== LOGIN DEBUG START ===');
    console.log('After trim - Email:', this.loginData.email);
    console.log('After trim - Password:', this.loginData.password);
    console.log('JSON:', JSON.stringify(this.loginData));
    console.log('=== LOGIN DEBUG END ===');
    
    if (!this.loginData.email || !this.loginData.password) {
      this.toastService.showError('Please enter both email and password', 'Validation Error');
      return;
    }
    
    this.loading = true;
    
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loading = false;
        this.toastService.showSuccess('Login successful!', 'Welcome');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.error);
        this.loading = false;
        const errorMessage = typeof error.error === 'string' ? error.error : 'Login failed';
        this.toastService.showError(errorMessage, 'Login Error');
      }
    });
  }
}