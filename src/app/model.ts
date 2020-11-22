export class weekDetails{
    constructor( 
       public lat:number,
       public lon:number,  
       public day:string,
       public temp:number,
       public img:string,
       public current:string,
       public date:Date,
       public humidity:string,
       public pressure:string,
    ){}
}

export class PlaceModel{
    constructor( 
        public name:string,
        public lat:string,
        public lon:string,
        public current:string,
    ){}
}