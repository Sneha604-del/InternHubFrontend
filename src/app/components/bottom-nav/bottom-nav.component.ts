import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="bottom-nav">
      <a routerLink="/documentation" routerLinkActive="active" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span>Docs</span>
      </a>
      <a routerLink="/groups" routerLinkActive="active" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <span>Groups</span>
      </a>
      <a routerLink="/attendance" routerLinkActive="active" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Attendance</span>
      </a>
      <a routerLink="/home" routerLinkActive="active" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span>Home</span>
      </a>
      <a routerLink="/profile" routerLinkActive="active" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
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
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      padding: 12px 8px;
      padding-bottom: calc(8px + env(safe-area-inset-bottom));
      z-index: 1000;
      box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
    }
    .nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      text-decoration: none;
      color: #6b7280;
      padding: 8px 4px;
      border-radius: 12px;
      transition: all 0.2s;
      min-height: 44px;
      justify-content: center;
    }
    .nav-item svg {
      width: 24px;
      height: 24px;
      stroke-width: 1.5;
      transition: all 0.2s;
    }
    .nav-item span {
      font-size: 11px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-item.active {
      color: #6366f1;
    }
    .nav-item.active svg {
      stroke-width: 2;
      transform: scale(1.1);
    }
    .nav-item.active span {
      font-weight: 600;
    }
    @media (max-width: 480px) {
      .nav-item span {
        font-size: 10px;
      }
      .nav-item svg {
        width: 22px;
        height: 22px;
      }
    }
  `]
})
export class BottomNavComponent {}
