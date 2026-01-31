import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { NotificationService } from '../../services/notification.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {
  notificationCount = 0;
  showLogoutPopup = false;
  showBackButton = false;
  pageTitle = 'InternHub';

  private pageTitles: { [key: string]: string } = {
    '/home': 'InternHub',
    '/groups': 'Groups',
    '/profile': 'Profile',
    '/notifications': 'Notifications',
    '/documentation': 'Documentation',
    '/security': 'Security',
    '/internships': 'Internships',
    '/apply': 'Apply',
    '/help-support': 'Help & Support',
    '/favorites': 'Favorites',
    '/group-create': 'Create Group',
    '/group-edit': 'Edit Group',
    '/group-details': 'Group Details',
    '/group-invitations': 'Group Invitations',
    '/attendance': 'Attendance'
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateBackButtonVisibility(event.url);
    });
    
    // Subscribe to profile edit mode changes
    this.profileService.editMode$.subscribe(isEditMode => {
      if (this.router.url === '/profile') {
        this.showBackButton = isEditMode;
        this.pageTitle = isEditMode ? 'Edit Profile' : 'Profile';
      }
    });
  }

  ngOnInit(): void {
    // Initialize on component load
    this.updateBackButtonVisibility(this.router.url);
    this.loadNotificationCount();
    
    // Subscribe to notification count changes
    this.notificationService.unreadCount$.subscribe(count => {
      this.notificationCount = count;
    });
  }

  loadNotificationCount(): void {
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.notificationService.loadUnreadCount(user.id);
    }
  }

  updateBackButtonVisibility(url: string): void {
    const mainRoutes = ['/home', '/groups', '/profile', '/notifications', '/documentation'];
    const cleanUrl = url.split('?')[0];
    this.showBackButton = !mainRoutes.includes(cleanUrl);
    this.updatePageTitle(cleanUrl);
  }

  updatePageTitle(url: string): void {
    // Check for dynamic routes with IDs
    if (url.includes('/group-edit/')) {
      this.pageTitle = 'Edit Group';
    } else if (url.includes('/group-details/')) {
      this.pageTitle = 'Group Details';
    } else {
      // Use the mapping for static routes
      this.pageTitle = this.pageTitles[url] || 'InternHub';
    }
  }

  goBack(): void {
    const currentUrl = this.router.url;
    
    if (currentUrl === '/profile') {
      this.profileService.setEditMode(false);
    } else if (currentUrl.includes('/apply')) {
      window.history.back();
    } else if (currentUrl.includes('/internships')) {
      window.history.back();
    } else if (currentUrl.includes('/group')) {
      this.router.navigate(['/groups']);
    } else if (currentUrl.includes('/favorites') || 
               currentUrl.includes('/help-support') || 
               currentUrl.includes('/reviews') || 
               currentUrl.includes('/security')) {
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