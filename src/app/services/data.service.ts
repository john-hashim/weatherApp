import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http:HttpClient){}
  api="8ef4ae3a2c5adb586e4b89b2452e27ac";

  // gapi="AIzaSyD8zdx7P_M0j1oKNrs6TyjfW7zYYrUg3E8"
  // getLocation(lat,lon){
  //     return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${this.gapi}`).subscribe(val=>console.log(val));
  // }

  getDailyForcast(lat,lon){
    return this.http.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${this.api}`)
    .pipe(map(value=>value));
  }
}
