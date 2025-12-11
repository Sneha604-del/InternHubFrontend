import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="example-container">
      <h2>Toast Examples</h2>
      <div class="buttons">
        <button (click)="showSuccess()" class="btn success">Success Toast</button>
        <button (click)="showError()" class="btn error">Error Toast</button>
        <button (click)="showWarning()" class="btn warning">Warning Toast</button>
        <button (click)="showInfo()" class="btn info">Info Toast</button>
      </div>
    </div>
  `,
  styles: [`
    .example-container { padding: 20px; max-width: 400px; margin: 0 auto; }
    .buttons { display: flex; flex-direction: column; gap: 10px; }
    .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
    .success { background: #28a745; color: white; }
    .error { background: #dc3545; color: white; }
    .warning { background: #ffc107; color: #212529; }
    .info { background: #17a2b8; color: white; }
  `]
})
export class ToastExampleComponent {
  constructor(private toastService: ToastService) {}

  showSuccess() {
    this.toastService.showSuccess('Operation completed successfully!', 'Success');
  }

  showError() {
    this.toastService.showError('Something went wrong!', 'Error');
  }

  showWarning() {
    this.toastService.showWarning('Please check your input!', 'Warning');
  }

  showInfo() {
    this.toastService.showInfo('Here is some information!', 'Info');
  }
}