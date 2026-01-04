import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {
  notificationCount = 3;
  showLogoutPopup = false;
  showBackButton = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateBackButtonVisibility(event.url);
    });
  }

  ngOnInit(): void {}

  updateBackButtonVisibility(url: string): void {
    const mainRoutes = ['/home', '/groups', '/profile', '/notifications', '/documentation'];
    this.showBackButton = !mainRoutes.includes(url.split('?')[0]);
  }

  goBack(): void {
    const currentUrl = this.router.url;
    
    if (currentUrl.includes('/group')) {
      this.router.navigate(['/groups']);
    } else if (currentUrl.includes('/favorites') || 
               currentUrl.includes('/help-support') || 
               currentUrl.includes('/reviews') || 
               currentUrl.includes('/security') ||
               currentUrl === '/profile/edit') {
      this.router.navigate(['/profile']);
    } else if (currentUrl.includes('/profile')) {
      this.router.navigate(['/profile']);
    } else if (currentUrl.includes('/documentation')) {
      this.router.navigate(['/documentation']);
    } else if (currentUrl.includes('/notification')) {
      this.router.navigate(['/notifications']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  viewNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  confirmLogout(): void {
    this.showLogoutPopup = true;
  }

  closePopup(): void {
    this.showLogoutPopup = false;
  }

  logout(): void {
    this.showLogoutPopup = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}