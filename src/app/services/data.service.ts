import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http:HttpClient){}
  api="8ef4ae3a2c5adb586e4b89b2452e27ac";


  getDayArray(){
    // this.http.get(`http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${this.api}`)
    //     .subscribe(val=>{
    //       console.log(val);
    //     })

    
    // return this.weekDetails;
  }
  getDailyForcast(){
    return this.http.get(`http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${this.api}`)
    .pipe(map(value=>value));
  }
}
