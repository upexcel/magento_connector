import { Injectable }    from '@angular/core';
import { Storage } from '@ionic/storage';
import _ from 'lodash';
@Injectable()
export class cartService {
    done: boolean;
    cartData: any = [];
    constructor(public local: Storage) {
    }
    addCart(data, keyGrop) {
        //        var cartData = [];
        var count = 0;
        var keyDataCheck: boolean;
        console.log(keyGrop);
//        this.cartData = this.local.get('item').__zone_symbol__value;
        console.log(this.cartData);
                this.local.get('item').then((value: any) => {
                    this.cartData =  JSON.parse(value);
               
        //        
        //if local saved data found
        
        if (this.cartData) {
            //local/cartdata is not null
            if (this.cartData && this.cartData.length > 0) {
                //iterate cartdata and if ned aded item has same id and size
                _.forEach(this.cartData, function(value, key) {
                    keyDataCheck = true;
                    //increse count in cartitem for that item only
                    if (data.type == "configurable") {
                        for (var i = 0; i < keyGrop.length; i++) {
                            var keyNo = keyGrop[i];
                            if (value[keyNo] != "undefined") {
                                if (data.id == value.id && data[keyNo] == value[keyNo]) {
                                    console.log("data"+data[keyNo]);
                                    console.log("value"+value[keyNo]);
                                    keyDataCheck = true && keyDataCheck;
                                }
                                else {
                                    console.log("data"+data[keyNo]);
                                    console.log("value"+value[keyNo]);
                                    keyDataCheck = false && keyDataCheck;
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
                        console.log("simple data");
                        if (data.id == value.id && data.type == value.type) {
                            value.quantity = value.quantity + data.quantity;
                            count = 1;
                        }
                        //else push has new item 
                        else {
                        }
                    }
                    else {
                        if (data.id == value.id && data.type == value.type) {
                            value.quantity = value.quantity + data.quantity;
                            count = 1;
                        }
                    }
                });
                if (count != 1) {
                    this.cartData.unshift(data);
                }
                else {

                }
            }
            //            //if local is set to null
            else {
                this.cartData.unshift(data);
            }
        }
        //        //if no pre saved data
        else {
            this.cartData = [];
            this.cartData.unshift(data);

        }
        this.local.set('item', JSON.stringify(this.cartData));
        return Promise.resolve(this.cartData);
        
         });
    }

}




