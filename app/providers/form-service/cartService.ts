import { Injectable }    from '@angular/core';
import { Storage, LocalStorage } from 'ionic-angular';
import * as _ from 'lodash';
@Injectable()
export class cartService {
    local:any;
    constructor() {
    this.local = new Storage(LocalStorage);
    }
    addCart(data , keyGrop) {
        var cartData = [];
        var count = 0;
        var keyDataCheck:boolean;
        console.log(keyGrop);
        cartData = JSON.parse(localStorage.getItem('item'));
//        console.log(cartData);
        //if local saved data found
        if (cartData) {
            //local/cartdata is not null
            if (cartData && cartData.length > 0) {
                //iterate cartdata and if ned aded item has same id and size
                _.forEach(cartData, function(value, key) {
                    keyDataCheck=true;
                    //increse count in cartitem for that item only
                    if (data.type == "configurable") {
                        for (var i = 0; i < keyGrop.length; i++) {
                            var keyNo=keyGrop[i];
                            if(value[keyNo]!="undefined"){
                                if (data.id == value.id && data[keyNo] == value[keyNo]) {
                                    console.log(data[keyNo]); console.log(value[keyNo]);
                                    keyDataCheck=true && keyDataCheck;
                                }  
                                else{
                                   console.log(data[keyNo]); console.log(value[keyNo]);
                                   keyDataCheck=false && keyDataCheck; 
                                }
                            }
                        }
                        console.log(keyDataCheck); 
                        if (keyDataCheck == true) {
                            value.quantity = value.quantity + data.quantity;
                            count = 1;
                        }                       
                    }
                    else if (data.type == "simple") {
                        if (data.id == value.id && data.type == value.type) {
                            value.quantity = value.quantity + data.quantity;
                            count = 1;
                        }
                        //else push has new item 
                        else {
                        }
                    }   
                });
                if (count != 1) {
                cartData.unshift(data);
                }
                else {

                }
            }
            //if local is set to null
            else {
                    cartData.unshift(data);
            }
        }
        //if no pre saved data
        else {
            cartData = [];
                cartData.unshift(data);
            
        }
        this.local.set('item', JSON.stringify(cartData));
        return Promise.resolve(cartData);
    }

}