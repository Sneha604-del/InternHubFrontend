import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() {}

  getCurrentPosition(): Observable<LocationCoordinates> {
    if (!navigator.geolocation) {
      return throwError(() => new Error('Geolocation is not supported by this browser'));
    }

    return from(new Promise<LocationCoordinates>((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage = 'Location access denied';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    }));
  }

  checkLocationPermission(): Promise<PermissionState> {
    if (!navigator.permissions) {
      return Promise.resolve('prompt' as PermissionState);
    }

    return navigator.permissions.query({ name: 'geolocation' })
      .then(result => result.state);
  }
}