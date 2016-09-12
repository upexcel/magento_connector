import { Component} from '@angular/core';
import { cartpage } from '../cart/cart';
import { NavController,NavParams, Storage, LocalStorage} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import { LoadingController } from 'ionic-angular';
@Component({
    templateUrl: 'build/pages/product/product.html',
    providers: [FormService]
})
export class productpage {
    quantity: number = 1;
    response:any ;
    activeSize:boolean=false;
    activeColor:boolean=false;
    itemSize:string;
    itemColor:string;
    selectSize:string;
    selectColor:string;
    constructor(public loadingCtrl: LoadingController, private navCtrl: NavController ,private navParams: NavParams, private _formService: FormService ) {
         let id = navParams.get('id');
         this.presentLoading();
                let path = { sku: id, "product_data_type": "large_data" };
        //api for get selected item
        this._formService.api("product/get/", path).subscribe((res) => {
            if (res) {
                this.response = res;
                if(this.response.data.associated_products){
                if (this.response.data.associated_products.attributes['180'].label == "Size") {
                    this.activeSize = true;
                    this.itemSize = this.response.data.associated_products.attributes['180'].options['0'].label;
                } 
                if (this.response.data.associated_products.attributes['92'].label == "Color") {
                    this.activeColor = true;
                    this.itemColor = this.response.data.associated_products.attributes['92'].options['0'].label;
                    console.log(this.itemColor);
                }
                }
            }
        },
            (err) => {

                if (err) {
                    console.log(err);
                }

            })
    }
    remove() {
        if (this.quantity > 1)
            this.quantity--;
    }
    add() {
        if(this.quantity < this.response.data.data.qty){
        this.quantity++;
        }
    }
    gotocart() {
        this.navCtrl.push(cartpage);
    }
    addcart(response){
//        var sku = response.sku;
//        var img = response.media_images;
//        var price = response.display_price;
//        var name = response.name;
//
//        let q = this.q;
//
//        let data = { id: sku, no: this.quantity, img: img, name: name, price: price, size: this.itemSize, qty: q };
//
//        this.array1 = JSON.parse(localStorage.getItem('item'));
//        this._total.getTotal(this.array1).then((response) => {
//            this.total = response;
//            this._total.addCart(data).then((response) => {
//                this.item = response;
//               this.navCtrl.push(cartpage);
//            });
//        }); 
    }
     presentLoading(){
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 2000
    });
    loader.present();
  }
}

