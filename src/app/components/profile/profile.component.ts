import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div class="profile-container">
      <h1>Profile</h1>
      <p>User profile information goes here.</p>
    </div>
  `,
  styles: [`
    .profile-container { padding: 12px; max-width: 900px; margin: 0 auto; min-height: 100%; background: #f5f5f5; }
    @media (min-width: 768px) {
      .profile-container { padding: 20px; }
    }
  `]
})
export class ProfileComponent {}
