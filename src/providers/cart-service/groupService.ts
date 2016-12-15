import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
declare let Promise: any;
@Injectable()

export class GroupService {
    constructor(private _local: Storage) {
    }
    addCart(other, data: any) {
        //        var subProductId = {
        //            data: other,
        //            subdata: []
        //        };
        console.log(other);
        let keyDataCheck: boolean = false;
        var subData = [];
        let count=0;
        return this._local.get('CartData').then((localData: any) => {
            console.log('group services', localData);
            forEach(other.options, function(value, key) {
                console.log(value);
                if (value != 0) {
                    forEach(data.body.group_associated_products, function(value1, key1) {
                       
                        if (value1.product_id == key) {
                            if (localData && localData.length > 0) {
                                forEach(localData, function(value2, key2) {
                                     keyDataCheck = true;
                                    if (value1.product_id == value2.product_id && value2.type == "grouped") {
                                        value2.quantity++
                                        keyDataCheck = true && keyDataCheck;
                                        console.log(keyDataCheck);
                                    } else {
                                        keyDataCheck = false && keyDataCheck;
                                        console.log(keyDataCheck);
                                    }
                                });
                               
                                
                            } else {
                                value1.quantity = value;
                                value1.type = other.type
                                subData.push(value1);
                            }
                        }
                    });
                }
            });


            console.log(localData);

            return new Promise(function(resolve, reject) {
                if (localData) {
                    localData.unshift(subData);
                } else {
                    localData = [];
                    localData.push(subData);
                }
                var data = localData[0];
                localData.splice(0, 1);
                for (var i = 0; i < data.length; i++) {
                    localData.unshift(data[i]);
                }

                resolve(localData)
            });
        });

    }
}
