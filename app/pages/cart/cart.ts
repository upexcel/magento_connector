import { Component} from '@angular/core';
import { NavController, Storage, LocalStorage ,NavParams} from 'ionic-angular';
import * as _ from 'lodash';
import {filter} from '../pipe/pipe';
@Component({
    templateUrl: 'build/pages/cart/cart.html',
    pipes: [filter]
})
export class cartpage {
    local:any;
    res:any = [];
    lists=[];
      constructor(private navCtrl: NavController ,private navParams: NavParams ) {
          this.local = new Storage(LocalStorage);
          this.res=JSON.parse(localStorage.getItem('item'));
  this.test();
  console.log(this.res);
      }
      test(){
          var  tempObj=[];
            _.forEach( this.res, function(value, key) {
                _.forEach(value, function(value1, key) {
            tempObj.push(key);
            });  
            });
      this.lists=_.uniq(_.pullAll(tempObj,['id', 'name', 'img' ,'price' ,'type','quantity']));
      }
      add(data){
          var cartData = [];
        var UpdatecartData = [];
        cartData = JSON.parse(localStorage.getItem('item'));
        data.quantity++;
        _.forEach(cartData, function(value, key) {
            //push has new item 
            if (data.id == value.id && data.type == value.type) {
                UpdatecartData.push(data);
            }
            //else push has old item 
            else {
                UpdatecartData.push(value);
            }
        });
        localStorage.setItem('item',JSON.stringify(UpdatecartData));
      }
      remove(data){
        var cartData = [];
        var UpdatecartData = [];
            data.quantity--;
            cartData = JSON.parse(localStorage.getItem('item'));
            _.forEach(cartData, function(value, key) {
                //push has new item 
                if (data.id == value.id && data.type == value.type) {
                    UpdatecartData.push(data);
                }
                //else push has old item 
                else {
                    UpdatecartData.push(value);
                }
            });
            localStorage.setItem('item', JSON.stringify(UpdatecartData));
      }
      delete(data){
        var cartData = [];
          let val = JSON.parse(localStorage.getItem('item'));
          var output;
          var f = _.findIndex(val, { 'id': data.id, 'type': data.type });

          output = _.difference(val, val.splice(f, 1));

          localStorage.setItem('item', JSON.stringify(output));
          this.res = output;
      }
}