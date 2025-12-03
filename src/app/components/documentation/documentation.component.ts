import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="doc-container">
      <div class="tabs">
        <button 
          class="tab" 
          [class.active]="activeTab === 'documents'"
          (click)="activeTab = 'documents'">
          Your Documents
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'certificate'"
          (click)="activeTab = 'certificate'">
          Certificate
        </button>
      </div>

      <div class="tab-content">
        <div *ngIf="activeTab === 'documents'">
          <h2>Your Documents</h2>
          <p>Your documents will appear here.</p>
        </div>
        
        <div *ngIf="activeTab === 'certificate'">
          <h2>Certificate</h2>
          <p>Your certificates will appear here.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .doc-container { padding: 16px; min-height: 100vh; background: #f8f9fa; }
    .tabs { display: flex; gap: 0; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); justify-content: center; margin-bottom: 16px; overflow: hidden; }
    .tab { padding: 12px 24px; background: white; border: none; cursor: pointer; font-size: 14px; color: #666; transition: all 0.2s; }
    .tab:hover { color: #007bff; }
    .tab.active { background: #007bff; color: white; }
    .tab-content { padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); min-height: calc(100vh - 120px); }
    h2 { margin-top: 0; color: #333; }
    p { color: #666; }
  `]
})
export class DocumentationComponent {
  activeTab: 'documents' | 'certificate' = 'documents';
}
