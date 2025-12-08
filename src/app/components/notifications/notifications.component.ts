import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Notifications</h1>
        <button *ngIf="unreadCount > 0" (click)="markAllAsRead()" class="mark-all-btn">Mark All Read</button>
      </div>
      
      <div *ngIf="loading" class="loading">Loading notifications...</div>
      
      <div *ngIf="!loading && notifications.length === 0" class="empty">
        <p>No notifications yet</p>
      </div>
      
      <div *ngIf="!loading && notifications.length > 0" class="notifications-list">
        <div *ngFor="let notification of notifications" 
             class="notification-item" 
             [class.unread]="!notification.read"
             (click)="markAsRead(notification)">
          <div class="notification-content">
            <h3>{{ notification.title }}</h3>
            <p>{{ notification.message }}</p>
            <span class="time">{{ formatTime(notification.createdAt) }}</span>
          </div>
          <div *ngIf="!notification.read" class="unread-dot"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 420px; margin: 0 auto; padding: 16px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .header h1 { font-size: 22px; font-weight: 700; color: #2c3e50; margin: 0; }
    .mark-all-btn { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
    .loading, .empty { text-align: center; padding: 40px 20px; color: #999; }
    .notifications-list { display: flex; flex-direction: column; gap: 12px; }
    .notification-item { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; position: relative; transition: all 0.2s; }
    .notification-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .notification-item.unread { border-left: 4px solid #007bff; background: #f8f9ff; }
    .notification-content h3 { font-size: 16px; font-weight: 600; color: #2c3e50; margin: 0 0 8px 0; }
    .notification-content p { font-size: 14px; color: #7f8c8d; margin: 0 0 8px 0; line-height: 1.4; }
    .time { font-size: 12px; color: #95a5a6; }
    .unread-dot { position: absolute; top: 16px; right: 16px; width: 8px; height: 8px; background: #007bff; border-radius: 50%; }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.notificationService.getNotifications(user.id).subscribe({
        next: (data) => {
          this.notifications = data;
          this.unreadCount = data.filter(n => !n.read).length;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  markAsRead(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.read = true;
        this.unreadCount--;
        this.notificationService.updateUnreadCount(this.unreadCount);
      });
    }
  }

  markAllAsRead() {
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.notificationService.markAllAsRead(user.id).subscribe(() => {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
        this.notificationService.updateUnreadCount(0);
      });
    }
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}