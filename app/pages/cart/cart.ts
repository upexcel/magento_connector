import { Component} from '@angular/core';
import { NavController, Storage, LocalStorage ,NavParams} from 'ionic-angular';
@Component({
    templateUrl: 'build/pages/cart/cart.html'
})
export class cartpage {
    id;
     no;
     img:any;
     name:string;
      price:number;
      size: string;
      qty:number; 
      constructor(private navCtrl: NavController ,private navParams: NavParams ) {
          
          this.id = navParams.get('id');
          this.no = navParams.get('no');
          this.img = navParams.get('img');
          this.name = navParams.get('name');
          this.price = navParams.get('price');
          this.size = navParams.get('size');
          this.qty = navParams.get('qty');
          
      }
      
}