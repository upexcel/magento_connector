import { Injectable }    from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import _ from 'lodash';
declare var Promise: any;
@Injectable()
export class cartService {
    done: boolean;
    constructor(public local: Storage) {
    }
    addCart(data, keyGrop): any {
        this.local.get('item').then((value: any) => {
            console.log(value);
            var count = 0;
            var keyDataCheck: boolean;
            var cartData: any = [];
            cartData = JSON.parse(value);
            if (value) {
                //local/cartdata is not null
                if (value && cartData.length > 0) {
                    //iterate cartdata and if ned aded item has same id and size
                    _.forEach(cartData, function(value, key) {
                        keyDataCheck = true;
                        //increse count in cartitem for that item only
                        if (data.type == "configurable") {
                            for (var i = 0; i < keyGrop.length; i++) {
                                var keyNo = keyGrop[i];
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
                                value.quantity = value.quantity + data.quantity;
                                count = 1;
                            }
                        }
                        else if (data.type != "configurable") {
                            if (data.id == value.id && data.type == value.type) {
                                value.quantity = value.quantity + data.quantity;
                                count = 1;
                            }
                            //else push has new item 
                            else {
                            }
                        }
//                        else {
//                            if (data.id == value.id && data.type == value.type) {
//                                value.quantity = value.quantity + data.quantity;
//                                count = 1;
//                            }
//                        }
                    });
                    if (count != 1) {
                        cartData.unshift(data);
                    }
                    else {

                    }
                }
                //            //if local is set to null
                else {
                    cartData.unshift(data);
                }
            }
            //        //if no pre saved data
            else {
                cartData = [];
                cartData.unshift(data);
            }
            if(cartData != "undefined"){
            this.local.set('item', JSON.stringify(cartData));
            return new Promise((resolve: any, reject: any) => resolve(cartData));
            }
        });
    }
}