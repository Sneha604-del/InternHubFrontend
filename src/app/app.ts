import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNavComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'InternHubFrontend';
  showBackButton = false;
  
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const mainRoutes = ['/home', '/documentation', '/profile', '/'];
      this.showBackButton = !mainRoutes.includes(event.url.split('?')[0]);
    });
  }
  
  goBack() {
    this.router.navigate(['/home']);
  }
  
  logout() {
    console.log('Logout clicked');
    // Add logout logic here
  }
}
