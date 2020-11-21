import { Component, OnInit } from '@angular/core';
import { DataService } from '../app/services/data.service';
import { Chart } from 'chart.js';
import { weekDetails,PlaceModel }from '../app/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  chart=[];
  chart2=[]
  singleweek:weekDetails

  constructor(private DataService:DataService){}

  flag1:number=0;

  searchInput:string;

  title = 'weatherapp';

  placeAttribute:PlaceModel[]=[{name:'mumbai',lat:'19.0760',lon:'72.8777',current:'Clouds'},
              {name:'Chennai',lat:'13.0827',lon:'80.2707',current:null},
              {name:'kolkata',lat:'22.5726',lon:'88.3639',current:null},
              {name:'pune',lat:'18.5204',lon:'73.8567',current:null},
              {name:'bengaluru',lat:'12.9716',lon:'77.5946',current:null},
              {name:'New Delhi',lat:'28.6139',lon:'77.2090',current:null},
            ];

  graphDetails:weekDetails[]=[];

  weatherDetails:weekDetails[]=[];

  location={
    latitude:null,
    longitude:null
  }
  weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  
  ngOnInit(){
      this.DataService.getDailyForcast().subscribe(res=>{
          res['list'].forEach((val,index)=>{
            this.singleweek=new weekDetails(this.weekday[new Date(val.dt_txt).getDay()],val.main.temp,val.weather[0].main,val.weather[0].main,new Date(val.dt_txt),val.main.humidity,val.main.pressure)
            this.flag1++;
            if(this.flag1==1||this.flag1==9||this.flag1==17||this.flag1==25||this.flag1==33||this.flag1==40){
              this.weatherDetails.push(this.singleweek);
            }
          })
          // this.weatherDetails.push(this.singleweek);
          this.graphDetails.push(this.weatherDetails[0]);
      })
      navigator.geolocation.getCurrentPosition((position)=>{
        this.location.latitude=position.coords.latitude;
        this.location.longitude=position.coords.longitude;
      });
  }



  clickOnSearch(){

  }



  onKey(val){
    this.placeAttribute.forEach(function(names){

      if(names.name.toLowerCase().indexOf(val) != -1){

        let filterParent=window.document.querySelector('.filter-parent');
        let filterDiv=document.createElement('div');

        let p=document.createElement('div');
        let div=document.createElement('div')

        div.innerHTML=`${names.current}`
        p.innerText=`${names.name}`

        filterDiv.appendChild(p)
        filterDiv.appendChild(div)

        if(div.innerText=="Clouds"){
          let img=document.createElement('img')
          img.src="../assets/icons/small/cloudy.png"
          filterDiv.appendChild(img);
        }
        else if(div.innerText=="Rain"){
          let img=document.createElement('img')
          img.src="../assets/icons/small/Rain.png"
          filterDiv.appendChild(img);
        }
        else{
          let img=document.createElement('img')
          img.src="../assets/icons/small/sun.png"
          filterDiv.appendChild(img);
        }
        
        filterDiv.className="filter"; 
        filterDiv.setAttribute("data-aos-duration","1000")
        filterDiv.setAttribute("data-aos","fade-up")

        filterParent.appendChild(filterDiv);
        console.log(filterDiv);
      }
    })
    setTimeout(function(){
        document.querySelectorAll('.filter').forEach(val=>val.remove());
    },2000)
  }




  onSelectDay(day){
    this.graphDetails.pop();
    this.graphDetails.push(day);
      this.DataService.getDailyForcast()
      .subscribe(res=>{

        let temp_max = res['list'].map(res => res.main.temp_max);
        let temp_min = res['list'].map(res => res.main.temp_min);
        let alldates = res['list'].map(res => res.dt)
      
        let sunrises =new Date((res['city'].sunrise)*1000)
        let sunset = new Date((res['city'].sunset)*1000)
        let sunTimings=[]
        sunTimings.push(`${sunrises.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})} SunRises`,`Date:${(day.date).getDate()}-${(day.date).getMonth()}`)
        sunTimings.push(`${sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}SunSet`)

        let weatherDates = []
        alldates.forEach((res) => {
        let jsdate = new Date(res * 1000)
            if(day.date.getDay()==jsdate.getDay()){
              weatherDates.push(jsdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            }
        })
          this.chart = new Chart('canvas', {
            type: 'line',
            data: {
              labels: weatherDates,
              datasets: [
                { 
                  data: temp_max,
                  borderColor: "#3cba9f",
                  fill: true
                }
              ]
            },
            options: {
              legend: {
                display: false
              },
              scales: {
                xAxes: [{
                  display: true
                }],
                yAxes: [{
                  display:false
                }],
              }
            }
          });

          this.chart2 = new Chart('canvas1', {
            type: 'line',
            data: {
              labels: sunTimings,
              datasets: [
                { 
                  data: sunrises,
                  borderColor: "#3cba9f",
                  fill: true
                }
              ]
            },
            options: {
              legend: {
                display: false
              },
              scales: {
                xAxes: [{
                  display: true
                }],
                yAxes: [{
                  display:true
                }],
              }
            }
          });

          
        
      })
  }
}
