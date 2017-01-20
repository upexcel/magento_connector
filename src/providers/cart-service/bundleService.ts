import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
declare let Promise: any;
@Injectable()

export class bundleService {
    constructor(private _local: Storage) {
    }
    addCart(other, price, data: any) {
        //        var subProductId = {
        //            data: other,
        //            subdata: []
        //        };
        var sub_data: any = {}
        var subData = [];
        return this._local.get('CartData').then((localData: any) => {
            sub_data.id = data.data.entity_id;
            sub_data.img = data.data.small_image;
            sub_data.name = data.data.name;
            sub_data.type = data.data.type;
            sub_data.quantity = "1";
            sub_data.select = other;
            sub_data.price = price;
            var check;
            //                if (value != 0) {
            //                    forEach(data.body.group_associated_products, function(value1, key1) {
            //                        if (value1.product_id == key) {
            //                            alert('hello')
            //                            if (localData && localData.length > 0) {
            forEach(localData, function(value2, key2) {
                //                                    
                if (sub_data.id == value2.id && value2.type == "bundle") {
                    check = true;
                    value2.select = sub_data.select;
                } else {

                }
            });
            //                            } else {
            //                                value1.quantity = value;
            //                                value1.type = other.type
            //                                subData.push(value1);
            //                            }
            //                        }
            //                    });
            //                }
            //            });
            //
            //
            //
            return new Promise(function(resolve, reject) {
                if (localData) {
                    if (!check) {
                        localData.unshift(sub_data);
                    }
                } else {
                    localData = [];
                    localData.push(sub_data);
                }


                resolve(localData)
            });
        });

    }
}



