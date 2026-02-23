import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageKey = 'favoriteInternships';

  getFavorites(): any[] {
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  isFavorite(internshipId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === internshipId);
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
