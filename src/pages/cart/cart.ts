import { Component , OnInit} from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import _ from 'lodash';
import { Storage } from '@ionic/storage';
@Component({
    templateUrl: 'cart.html'
})
export class CartPage implements OnInit{
    res: any = [];
    lists = [];
    entery: boolean = false;
    constructor(public local: Storage, public navCtrl: NavController, public navParams: NavParams) { }
    ngOnInit() {
        this.local.get('item').then((value: any) => {
            this.res = JSON.parse(value);
            let tempObj = [];
            _.forEach(this.res, function(value, key) {
                _.forEach(value, function(value1, key) {
                    tempObj.push(key);
                });
            });
            this.lists = _.uniq(_.pullAll(tempObj, ['id', 'name', 'img', 'price', 'type', 'quantity']));
            this.entery = true;
        });
    }

    add(data) {
       this.local.get('item').then((value: any) => {
       let cartData = [];
       let UpdatecartData = [];
       let keyDataCheck: boolean;
           cartData = JSON.parse(value);
          data.quantity++;
               if (data.type == "configurable") {
                 let  keyGrop= _.uniq(_.pullAll(_.keys(data), ['id', 'name', 'img', 'price', 'type', 'quantity']));
                   _.forEach(cartData, function(value, key) {
                       keyDataCheck = true;
                       for (let i = 0; i < keyGrop.length; i++) {
                           let keyNo = keyGrop[i];
                           if (value[keyNo] != "undefined") {
                               if (data.id == value.id && data[keyNo] == value[keyNo]) {
                                   keyDataCheck = true && keyDataCheck;
                               }
                               else {
                                   keyDataCheck = false && keyDataCheck;
                               }
                           }
                       }
                       if (keyDataCheck == true) {
                           UpdatecartData.push(data);;

                       }
                       else {
                           UpdatecartData.push(value);
                       }
                   
           });
            this.local.set('item', JSON.stringify(UpdatecartData));
           }
            
           
           else {
     
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
           this.local.set('item', JSON.stringify(UpdatecartData));


       }
});
       }
           remove(data) {
       this.local.get('item').then((value: any) => {
       let cartData = [];
       let UpdatecartData = [];
       let keyDataCheck: boolean;
           cartData = JSON.parse(value);
          data.quantity--;
               if (data.type == "configurable") {
                 let  keyGrop= _.uniq(_.pullAll(_.keys(data), ['id', 'name', 'img', 'price', 'type', 'quantity']));
                   _.forEach(cartData, function(value, key) {
                       keyDataCheck = true;
                       for (let i = 0; i < keyGrop.length; i++) {
                           let keyNo = keyGrop[i];
                           if (value[keyNo] != "undefined") {
                               if (data.id == value.id && data[keyNo] == value[keyNo]) {
                                   keyDataCheck = true && keyDataCheck;
                               }
                               else {
                                   keyDataCheck = false && keyDataCheck;
                               }
                           }
                       }
                       if (keyDataCheck == true) {
                           UpdatecartData.push(data);;

                       }
                       else {
                           UpdatecartData.push(value);
                       }
                   
           });
            this.local.set('item', JSON.stringify(UpdatecartData));
           }
            
           
           else {
     
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
           this.local.set('item', JSON.stringify(UpdatecartData));


       }
});
       }

    delete(data) {
        let cartData = [];
        let tempObj = [];
        let dataloc = [];
        let key = [];
        let allKey = [];
        let iterate: any = [];
        let data1 = [];
        let val;
        this.local.get('item').then((value: any) => {
            val = JSON.parse(value);
            let output;
            let r = {};

            if (data.type == "configurable") {
                let dubData = data;
                key = _.uniq(_.pullAll(_.keys(dubData), ['id', 'name', 'img', 'price', 'type', 'quantity']));

                allKey = _.uniq(_.pullAll(_.keys(data), ['name', 'img', 'price', 'quantity']));
                for (var i = 0; i < allKey.length; i++) {
                    var keys = allKey[i];
                    iterate.push(data[keys]);
                }
                for (i = 0; i < keys.length; i++) {
                    r[allKey[i]] = iterate[i];
                };
                let f = _.findIndex(val, r);
                output = _.difference(val, val.splice(f, 1));
                this.local.set('item', JSON.stringify(output));
                this.res = output;
            }
            else {
                let f = _.findIndex(val, { 'id': data.id, 'type': data.type });
                output = _.difference(val, val.splice(f, 1));
                this.local.set('item', JSON.stringify(output));
                this.res = output;
            }
        });
    }
}  