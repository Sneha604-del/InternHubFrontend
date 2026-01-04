import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNavComponent, SplashScreenComponent, TopNavbarComponent, CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'InternHubFrontend';
  showBackButton = false;
  showNavigation = true;
  unreadCount = 0;
  currentPageTitle = 'InternHub';
  showSplash = true;
  
  constructor(
    private router: Router, 
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url.split('?')[0];
      const authRoutes = ['/login', '/register', '/'];
      this.showNavigation = !authRoutes.includes(url);
      const mainRoutes = ['/home', '/documentation', '/profile'];
      this.showBackButton = !mainRoutes.includes(url) && this.showNavigation;
      
      const titles: { [key: string]: string } = {
        '/home': 'Home',
        '/internships': 'Internships',
        '/favorites': 'Favorites',
        '/profile': 'Profile',
        '/notifications': 'Notifications',
        '/apply': 'Apply',
        '/documentation': 'Documentation',
        '/help-support': 'Help & Support',
        '/reviews': 'Reviews',
        '/groups': 'Groups',
        '/group-create': 'Create Group',
        '/group-invitations': 'Group Invitations'
      };
      this.currentPageTitle = titles[url] || 'InternHub';
      console.log('Current URL:', url, 'Title:', this.currentPageTitle);
    });
  }
  
  goBack() {
    this.router.navigate(['/home']);
  }
  
  confirmLogout() {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '380px',
      maxWidth: '90vw',
      panelClass: 'custom-logout-dialog',
      disableClose: false,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
  
  ngOnInit() {
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
    
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.notificationService.loadUnreadCount(user.id);
    }
  }
  
  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  onSplashComplete() {
    this.showSplash = false;
  }
}

@Component({
  selector: 'logout-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="logout-dialog-wrapper">
      <h1 class="dialog-title">Logout</h1>
      <p class="dialog-message">Are you sure you want to logout?</p>
      <div class="button-group">
        <button mat-flat-button class="cancel-btn" [mat-dialog-close]="false">Cancel</button>
        <button mat-flat-button class="logout-btn" [mat-dialog-close]="true">Logout</button>
      </div>
    </div>
  `,
  styles: [`
    .logout-dialog-wrapper {
      text-align: center;
      padding: 8px;
    }
    .dialog-title {
      font-size: 28px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 12px 0;
    }
    .dialog-message {
      font-size: 16px;
      color: #718096;
      margin: 0 0 32px 0;
      line-height: 1.6;
    }
    .button-group {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .cancel-btn, .logout-btn {
      flex: 1;
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 8px;
      text-transform: none;
      letter-spacing: 0.3px;
    }
    .cancel-btn {
      background: #e2e8f0;
      color: #4a5568;
    }
    .cancel-btn:hover {
      background: #cbd5e0;
    }
    .logout-btn {
      background: #dc3545 !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    }
    .logout-btn:hover {
      background: #c82333 !important;
      box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
      transform: translateY(-1px);
    }
  `]
})
export class LogoutDialogComponent {}
