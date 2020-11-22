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

  constructor(public DataService:DataService){}

  flag1:number=0;

  searchInput:string;

  title = 'weatherapp';

  placeModel:PlaceModel;

  placeAttribute:PlaceModel[]=[{name:'mumbai',lat:'19.0760',lon:'72.8777',current:''},
              {name:'Chennai',lat:'13.0827',lon:'80.2707',current:''},
              {name:'kolkata',lat:'22.5726',lon:'88.3639',current:''},
              {name:'pune',lat:'18.5204',lon:'73.8567',current:''},
              {name:'bengaluru',lat:'12.9716',lon:'77.5946',current:''},
              {name:'Hyderabad',lat:'17.3850',lon:'78.4867',current:''},
              {name:'Kerala',lat:'10.8505',lon:'76.2711',current:''},
              {name:'Tamil Nadu',lat:'11.1271',lon:'78.6569',current:''},
              {name:'Karnataka',lat:'15.3173',lon:'75.7139',current:''},
              {name:'Himalayas',lat:'28.5983',lon:'83.9311',current:''},
              {name:'Gurugram',lat:'28.4595',lon:'77.0266',current:''},
            ];

  graphDetails:weekDetails[]=[];

  weatherDetails:weekDetails[]=[];

  location={
    latitude:null,
    longitude:null
  }
  weekday = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];


  ngOnInit(){
      //getting curresponding location and list the weather details when page realoads
      navigator.geolocation.getCurrentPosition((position)=>{
        this.getData(position.coords.latitude,position.coords.longitude)

        //this is a call for google map API,but a billing account is needed to get data
        //beacuse of that i hardcoded places and lat and lon
        // this.DataService.getLocation(position.coords.latitude,position.coords.longitude)
      })
  
      
  }
  getData(lat,lon){
    //weather details is bind to html so make it empty before any api call
    this.weatherDetails=[]
    this.DataService.getDailyForcast(lat,lon).subscribe(res=>{
      res['daily'].forEach((val,index)=>{
          //looping throug res.daily
          this.singleweek=new weekDetails(lat,lon,this.weekday[new Date(val.dt*1000).getDay()],val.temp.day,val.weather[0].main,val.weather[0].main,new Date(val.dt*1000),val.humidity,val.pressure)
          this.weatherDetails.push(this.singleweek);
      })
      this.onSelectDay(this.weatherDetails[0],)
   })
  }



  clickOnSearch(){
    document.querySelectorAll('.filter').forEach(val=>val.remove());
  }


  onKey(val){
      //getting entered input 
      if(val!=''){
        //removing filteres
        document.querySelectorAll('.filter').forEach(val=>val.remove());
        //iterating through array containing location information
        this.placeAttribute.forEach((names)=>{
          //checking input is matching fith array elements
          if(names.name.toLowerCase().indexOf(val) != -1){
          //accessing parent div to uppend
          let filterParent=window.document.querySelector('.filter-parent');
          //creating a main element filter div
          let filterDiv=document.createElement('div');
          
          //creating marker icon for location icon
          let markericon=document.createElement('i');
          markericon.setAttribute('class','fas fa-map-marker');
          filterDiv.appendChild(markericon);

          //creating a div element to append name of the city
          let p=document.createElement('div');
          p.className="name-of-city";

          let flexDiv=document.createElement('div');
          flexDiv.className='flex-div'


          //creating a p element to append temp
          let div=document.createElement('p');
          let p2=document.createElement('p');
          p2.className="temp";
          
          //geting data of curresponding location using api
          this.DataService.getDailyForcast(names.lat,names.lon).subscribe(res=>{
            //geting temp and weather status
            div.innerHTML=res['daily'][0].weather[0].main
            p2.innerHTML=`${res['daily'][0].temp.day}&#730;&#8490`

            //appending image bases on current status
            if(div.innerText=="Clouds"){
              let img=document.createElement('img');
              img.src="../assets/icons/small/cloudy.png";
              filterDiv.appendChild(img);
            }
            else if(div.innerText=="Rain"){
              let img=document.createElement('img');
              img.src="../assets/icons/small/rain.png";
              filterDiv.appendChild(img);
            }
            else{
              let img=document.createElement('img')
              img.src="../assets/icons/small/sun.png";
              filterDiv.appendChild(img);
            }
          })
          p.innerText=`${names.name}`
          flexDiv.appendChild(p2)
          flexDiv.appendChild(div);
          //appending all created elements to filterDiv
          filterDiv.appendChild(p);
          filterDiv.appendChild(flexDiv);
          console.log(filterDiv);
          filterDiv.className="filter"; 
          filterDiv.setAttribute("data-aos-duration","1000");
          filterDiv.setAttribute("data-aos","fade-up");
          //appending filterDiv to filterParent
          filterParent.appendChild(filterDiv);
          //adding event listnener to filters
          filterDiv.addEventListener('click',()=>{
            //set input value as clicked filter
            document.querySelector('input').value=document.querySelector('.name-of-city').lastChild.textContent;
            //call getData() for geting weather information
            this.getData(names.lat,names.lon);
            //removing filters when a value is selected
            document.querySelectorAll('.filter').forEach(val=>val.remove());
          })
        }
      })
      }
      if(val==''){
        document.querySelectorAll('.filter').forEach(val=>val.remove());
      }
  }

  //selecting a day from 8 days
  onSelectDay(day){
    //set graphDetails as selected Date
    this.graphDetails.pop();
    this.graphDetails.push(day);
    //call for weather detials on selected day
    this.DataService.getDailyForcast(day.lat,day.lon)
      .subscribe(res=>{
        //mapping temp to temp_max array
        let temp_max = res['hourly'].map(res => res.temp);
        //mapping  dates
        let alldates = res['hourly'].map(res => res.dt);
        //mapping sunrise time
        let sunrises =res['daily'].map(res=>res.sunrise);
        //mapping sunset time
        let sunset =res['daily'].map(res=>res.sunset);

        let sun=[]

        sunrises.forEach((res)=>{
          let rises=new Date(res*1000)
          if((day.date).getDate()==rises.getDate()){
            sun.push(`${rises.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})} SunRises`,`Date:${(day.date).getDate()}-${(day.date).getMonth()}`)
          }
        })

        sunset.forEach((res)=>{
          let sets=new Date(res*1000)
          if((day.date).getDate()==sets.getDate()){
             sun.push(`${sets.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}SunSet`)
          }

        })

        let weatherDates = []
        alldates.forEach((res) => {
        let jsdate = new Date(res * 1000)
        if((day.date).getDate()==jsdate.getDate()){
          weatherDates.push(jsdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        })
          this.chart = new Chart('canvas', {
            type: 'line',
            data: {
              labels: weatherDates,
              datasets: [
                { 
                  data: temp_max,
                  borderColor: "#1dd2ff",
                  backgroundColor: [
                    'rgba(145, 204, 253,0.2)',
                ],
                }
              ]
            },
            options: {
            //   animation: {
            //     onProgress: function(animation) {
            //         progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
            //     }
            // }
            legend: {
                display: false
              },
              scales: {
                xAxes: [{
                  display: true,
                  ticks: {
                    fontSize: 10
                }
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
              labels: sun,
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
                  display:true
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
