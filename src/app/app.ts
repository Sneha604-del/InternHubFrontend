import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNavComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'InternHubFrontend';
  showBackButton = false;
  showNavigation = true;
  unreadCount = 0;
  
  constructor(
    private router: Router, 
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url.split('?')[0];
      const authRoutes = ['/login', '/register', '/'];
      this.showNavigation = !authRoutes.includes(url);
      const mainRoutes = ['/home', '/documentation', '/profile'];
      this.showBackButton = !mainRoutes.includes(url) && this.showNavigation;
    });
  }
  
  goBack() {
    this.router.navigate(['/home']);
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
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
}
