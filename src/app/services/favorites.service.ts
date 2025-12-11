import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageKey = 'favoriteInternships';

  getFavorites(): any[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  isFavorite(internshipId: number): boolean {
    return this.getFavorites().some(fav => fav.id === internshipId);
  }

  toggleFavorite(internship: any): boolean {
    const favorites = this.getFavorites();
    const index = favorites.findIndex(fav => fav.id === internship.id);
    
    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
      return false;
    } else {
      favorites.push(internship);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
      return true;
    }
  }
}
