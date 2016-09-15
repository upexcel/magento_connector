import { Component} from '@angular/core';
import { cartpage } from '../cart/cart';
import { NavController, NavParams, Storage, LocalStorage} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
@Component({
    templateUrl: 'build/pages/product/product.html',
    providers: [FormService]
})
export class productpage {
    quantity: number = 1;
    response: any;
    activeSize: boolean = false;
    activeColor: boolean = false;
    quantityUpdate: boolean = false;
    condition:boolean =true;
    itemSize: string;
    itemColor: string;
    selectSize: string;
    selectColor: string;
    storage;
    product;
    price;
    images: any;
    constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, private navCtrl: NavController, private navParams: NavParams, private _formService: FormService) {
        this.product = "Product";
        let id = navParams.get('id');
        this.presentLoading();
        let path = { sku: id };
        this._formService.api("product/get/", path).subscribe((res) => {
            if (res) {
                this.response = res;
                this.price=this.response.data.data.display_price;
                this.images=this.response.data.data.media_images[0];
                this.product = this.response.data.data.name;
                if (this.response.data.data.qty > 0) {
                    this.quantityUpdate = true;
                }
                if (this.response.data.associated_products) {
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
    gotocart() {
        this.navCtrl.push(cartpage);
    }
    addcart(response) {
        this.presentToast("item inserted ");
        var sku = response.sku;
        var img = response.media_images;
        var price = response.display_price;
        var name = response.name;
        let data = { id: sku, no: this.quantity, img: img, name: name, price: price, size: this.itemSize, qty: this.quantity };
        this.storage = JSON.parse(localStorage.getItem('item'));
        //        this._total.getTotal(this.array1).then((response) => {
        //            this.total = response;
        //            this._total.addCart(data).then((response) => {
        //                this.item = response;
        this.navCtrl.push(cartpage);
        //            });
        //        }); 
    }
    presentLoading() {
        let loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 2000
        });
        loader.present();
    }
    presentToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
    slideClick(img){
        this.images=img;
    }
      onChange(val: any) {
    // onChange used when there is not an formControlName
    let myDiv = document.getElementById('color');
    myDiv.style.color = val;
    console.log(val);
  }
  onChangeSize(size:any , item:any){
      console.log(size, item);
  }
}
