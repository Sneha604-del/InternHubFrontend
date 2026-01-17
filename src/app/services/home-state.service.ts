import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeStateService {
  private state = {
    selectedCourse: '',
    selectedCategory: '',
    companies: [] as any[]
  };

  saveState(course: string, category: string, companies: any[]) {
    this.state = { selectedCourse: course, selectedCategory: category, companies };
  }

  getState() {
    return this.state;
  }

  clearState() {
    this.state = { selectedCourse: '', selectedCategory: '', companies: [] };
  }
}
