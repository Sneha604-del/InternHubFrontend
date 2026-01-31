import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="bottom-nav">
      <a routerLink="/documentation" routerLinkActive="active" class="nav-item">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <span>Documentation</span>
      </a>
      <a routerLink="/groups" routerLinkActive="active" class="nav-item">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span>Groups</span>
      </a>
      <a routerLink="/home" routerLinkActive="active" class="nav-item home-tab">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Home</span>
      </a>

      <a routerLink="/profile" routerLinkActive="active" class="nav-item">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Profile</span>
      </a>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      background: white;
      border-top: 1px solid #ddd;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      padding: 8px 0;
      min-height: 60px;
      z-index: 1000;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: #666;
      padding: 4px 8px;
      min-width: 44px;
      justify-content: center;
      transition: color 0.3s;
      font-size: 10px;
    }
    .nav-item.active {
      color: #007bff;
    }
    .icon {
      width: 18px;
      height: 18px;
      margin-bottom: 2px;
    }


    .home-tab {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white !important;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      margin: -20px 8px 0 8px;
      box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
      transform: scale(1.2);
      font-weight: 600;
      position: relative;
      z-index: 10;
      border: 3px solid white;
    }
    .home-tab .icon {
      width: 26px;
      height: 26px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      margin-bottom: 1px;
    }
    .home-tab span {
      font-size: 9px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      font-weight: 700;
    }
  `]
})
export class BottomNavComponent {}
