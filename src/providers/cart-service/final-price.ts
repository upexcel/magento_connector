import { Injectable}    from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
declare let Promise: any;
@Injectable()
export class FinalPrice {
    constructor(private _local: Storage) {
    }
    getPrice(data): any {
       return new Promise((resolve, reject)=> {
           forEach(data, function(value, key) {
 forEach(value.tier_price, function(value1, key1) {
               console.log(value1)
               console.log(key1)
           });});
           resolve(data);
       });
       }
}