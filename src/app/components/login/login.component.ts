import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoginRequest } from '../../models/student.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onSubmit(): void {
    this.loading = true;
    
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Login successful!', 'Welcome');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;
        this.toastService.showError(error.error || 'Login failed', 'Login Error');
      }
    });
  }
}