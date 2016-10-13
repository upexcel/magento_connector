import { Component} from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import _ from 'lodash';
import { Storage } from '@ionic/storage';
import {filter} from '../../pipe/pipe';
@Component({
    templateUrl: 'cart.html'
//        pipes: [filter]
})
export class cartpage {
    res: any = [];
    lists = [];
    entery:boolean=false;
    constructor(public local: Storage, public navCtrl: NavController, public navParams: NavParams) {
        this.local.get('item').then((value: any) => {
            this.res = JSON.parse(value);
            console.log(this.res);
            var tempObj = [];
            _.forEach(this.res, function(value, key) {
                _.forEach(value, function(value1, key) {
                    tempObj.push(key);
                });
            });
            this.lists = _.uniq(_.pullAll(tempObj, ['id', 'name', 'img', 'price', 'type', 'quantity']));
            console.log(this.lists);
            this.entery=true;
        });
    }
    add(data) {
        var cartData = [];
        var UpdatecartData = [];
        this.local.get('item').then((value: any) => {
            cartData = JSON.parse(value);
        });
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
        this.local.set('item', JSON.stringify(UpdatecartData));
    }
    remove(data) {
        var cartData = [];
        var UpdatecartData = [];
        data.quantity--;
        this.local.get('item').then((value: any) => {
            cartData = JSON.parse(value);
        });
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
    delete(data) {
        var cartData = [];
        var tempObj = [];
        var dataloc = [];
        var key = [];
        var allKey = [];
        var iterate: any = [];
        var data1 = [];
        var val;
        this.local.get('item').then((value: any) => {
            val = JSON.parse(value);
            var output;
            var r = {};

            if (data.type == "configurable") {
                var dubData = data;
                key = _.uniq(_.pullAll(_.keys(dubData), ['id', 'name', 'img', 'price', 'type', 'quantity']));

                allKey = _.uniq(_.pullAll(_.keys(data), ['name', 'img', 'price', 'quantity']));
                for (var i = 0; i < allKey.length; i++) {
                    var keys = allKey[i];
                    iterate.push(data[keys]);
                }
                for (i = 0; i < keys.length; i++) {
                    r[allKey[i]] = iterate[i];
                };
                console.log(r);
                console.log(val);
                var f = _.findIndex(val, r);
                output = _.difference(val, val.splice(f, 1));
                this.local.set('item', JSON.stringify(output));
                this.res = output;
            }
            else {
                var f = _.findIndex(val, { 'id': data.id, 'type': data.type });
                output = _.difference(val, val.splice(f, 1));
                this.local.set('item', JSON.stringify(output));
                this.res = output;
            }
        });
    }
}  