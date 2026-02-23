import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Notifications</h1>
        <div class="header-actions">
          <button class="filter-icon-btn" (click)="toggleFilters()">
            <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 4h18M3 12h12M3 20h6"/>
              <circle cx="20" cy="4" r="2"/>
              <circle cx="18" cy="12" r="2"/>
              <circle cx="12" cy="20" r="2"/>
            </svg>
          </button>
          <button *ngIf="unreadCount > 0" (click)="markAllAsRead()" class="mark-all-btn">Mark All Read</button>
        </div>
      </div>
      
      <div class="filters-panel" [class.show]="showFilters">
        <div class="filters-card">
          <div class="filter-section">
            <label>Status</label>
            <div class="filter-tabs">
        <button class="filter-tab" [class.active]="filter === 'all'" (click)="setFilter('all')">All</button>
        <button class="filter-tab" [class.active]="filter === 'unread'" (click)="setFilter('unread')">Unread</button>
        <button class="filter-tab" [class.active]="filter === 'read'" (click)="setFilter('read')">Read</button>
            </div>
          </div>
          
          <div class="filter-section">
            <label>Date Range</label>
            <div class="date-filter">
        <button class="date-btn" [class.active]="dateFilter === 'all'" (click)="setDateFilter('all')">All</button>
        <button class="date-btn" [class.active]="dateFilter === 'today'" (click)="setDateFilter('today')">Today</button>
        <button class="date-btn" [class.active]="dateFilter === 'week'" (click)="setDateFilter('week')">This Week</button>
        <button class="date-btn" [class.active]="dateFilter === 'month'" (click)="setDateFilter('month')">This Month</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="skeleton-container">
        <div *ngFor="let item of [1,2,3,4,5]" class="skeleton-notification">
          <div class="skeleton-content">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-message"></div>
            <div class="skeleton-line skeleton-time"></div>
          </div>
          <div class="skeleton-dot"></div>
        </div>
      </div>

      <div *ngIf="!loading && filteredNotifications.length === 0" class="empty">
        <p>{{ notifications.length === 0 ? 'No notifications yet' : 'No ' + filter + ' notifications' }}</p>
      </div>

      <div *ngIf="!loading && filteredNotifications.length > 0" class="notifications-list">
        <div *ngFor="let notification of filteredNotifications"
             class="notification-item"
             [class.unread]="!notification.read">
          <div class="notification-content" (click)="markAsRead(notification)">
            <h3>{{ notification.title }}</h3>
            <p>{{ notification.message }}</p>
            <span class="time">{{ formatTime(notification.createdAt) }}</span>
            
            <!-- Accept button for group invitations -->
            <div *ngIf="notification.type === 'GROUP_INVITATION' && !notification.read" class="notification-actions">
              <button class="accept-btn" (click)="acceptInvitation(notification, $event)">Accept</button>
              <button class="decline-btn" (click)="declineInvitation(notification, $event)">Decline</button>
            </div>
          </div>
          
          <!-- Mark as done icon -->
          <button *ngIf="!notification.read" class="mark-done-btn" (click)="markAsRead(notification)" title="Mark as done">✓</button>
          
          <div *ngIf="!notification.read" class="unread-dot"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 420px; margin: 0 auto; padding: 16px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .header h1 { font-size: 22px; font-weight: 700; color: #2c3e50; margin: 0; }
    .header-actions { display: flex; gap: 10px; align-items: center; }
    .filter-icon-btn { width: 40px; height: 40px; background: white; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .filter-icon-btn:hover { border-color: #667eea; background: #f8f9ff; }
    .filter-icon { width: 20px; height: 20px; color: #4a5568; }
    .filters-panel { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
    .filters-panel.show { max-height: 300px; margin-bottom: 16px; }
    .filters-card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .filter-section { margin-bottom: 16px; }
    .filter-section:last-child { margin-bottom: 0; }
    .filter-section label { display: block; font-size: 13px; font-weight: 600; color: #6c757d; margin-bottom: 8px; }
    .filter-tabs { display: flex; gap: 8px; margin-bottom: 12px; background: #f8f9fa; padding: 4px; border-radius: 8px; }
    .filter-tab { flex: 1; padding: 8px 12px; background: transparent; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; color: #6c757d; cursor: pointer; transition: all 0.2s; }
    .filter-tab.active { background: white; color: #007bff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .date-filter { display: flex; gap: 6px; margin-bottom: 16px; overflow-x: auto; }
    .date-btn { padding: 6px 12px; background: white; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 13px; font-weight: 500; color: #6c757d; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
    .date-btn.active { background: #007bff; color: white; border-color: #007bff; }
    .header h1 { font-size: 22px; font-weight: 700; color: #2c3e50; margin: 0; }
    .mark-all-btn { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
    .empty { text-align: center; padding: 40px 20px; color: #999; }
    .skeleton-container { display: flex; flex-direction: column; gap: 12px; }
    .skeleton-notification { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); position: relative; }
    .skeleton-content { display: flex; flex-direction: column; gap: 8px; }
    .skeleton-line { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
    .skeleton-title { width: 70%; height: 16px; }
    .skeleton-message { width: 90%; height: 14px; }
    .skeleton-time { width: 40%; height: 12px; }
    .skeleton-dot { position: absolute; top: 16px; right: 16px; width: 8px; height: 8px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 50%; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .notifications-list { display: flex; flex-direction: column; gap: 12px; }
    .notification-item { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; position: relative; transition: all 0.2s; }
    .notification-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .notification-item.unread { border-left: 4px solid #007bff; background: #f8f9ff; }
    .notification-content h3 { font-size: 16px; font-weight: 600; color: #2c3e50; margin: 0 0 8px 0; }
    .notification-content p { font-size: 14px; color: #7f8c8d; margin: 0 0 8px 0; line-height: 1.4; }
    .time { font-size: 12px; color: #95a5a6; }
    .mark-done-btn { position: absolute; bottom: 12px; right: 12px; width: 28px; height: 16px; background: #28a745; color: white; border: none; border-radius: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; transition: all 0.2s; }
    .mark-done-btn:hover { background: #218838; }
    .unread-dot { position: absolute; top: 16px; right: 16px; width: 8px; height: 8px; background: #007bff; border-radius: 50%; }
    .notification-actions { margin-top: 12px; display: flex; gap: 8px; }
    .accept-btn { padding: 6px 12px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; }
    .decline-btn { padding: 6px 12px; background: #dc3545; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; }
    .accept-btn:hover { background: #218838; }
    .decline-btn:hover { background: #c82333; }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  loading = true;
  unreadCount = 0;
  filter: 'all' | 'unread' | 'read' = 'all';
  dateFilter: 'all' | 'today' | 'week' | 'month' = 'all';
  showFilters = false;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }
  
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  loadNotifications() {
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      this.notificationService.getNotifications(user.id).subscribe({
        next: (data) => {
          this.notifications = data;
          this.unreadCount = data.filter(n => !n.read).length;
          this.applyFilter();
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }
  
  setFilter(filter: 'all' | 'unread' | 'read') {
    this.filter = filter;
    this.applyFilter();
  }
  
  setDateFilter(dateFilter: 'all' | 'today' | 'week' | 'month') {
    this.dateFilter = dateFilter;
    this.applyFilter();
  }
  
  applyFilter() {
    let filtered = this.notifications;
    
    // Apply read/unread filter
    if (this.filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (this.filter === 'read') {
      filtered = filtered.filter(n => n.read);
    }
    
    // Apply date filter
    if (this.dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(n => {
        const notifDate = new Date(n.createdAt);
        if (this.dateFilter === 'today') {
          return notifDate.toDateString() === now.toDateString();
        } else if (this.dateFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return notifDate >= weekAgo;
        } else if (this.dateFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return notifDate >= monthAgo;
        }
        return true;
      });
    }
    
    this.filteredNotifications = filtered;
  }

  markAsRead(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.read = true;
        this.unreadCount--;
        this.notificationService.updateUnreadCount(this.unreadCount);
        this.applyFilter();
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
        this.applyFilter();
      });
    }
  }

  acceptInvitation(notification: Notification, event: Event) {
    event.stopPropagation();
    // Store notification data and redirect to group invitations page
    localStorage.setItem('pendingInvitation', JSON.stringify(notification));
    this.router.navigate(['/group-invitations']);
  }

  declineInvitation(notification: Notification, event: Event) {
    event.stopPropagation();
    // Mark notification as read and decline invitation
    this.markAsRead(notification);
    // TODO: Add decline invitation API call
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
