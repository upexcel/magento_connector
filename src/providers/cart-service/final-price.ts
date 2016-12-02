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
console.log(value.tier_price.price*1 );
console.log(value.price*1);
console.log(value.tier_price.price_qty*1);
console.log(value.quantity*1);


console.log((value.tier_price.price*1) < (value.price*1) && (value.tier_price.price_qty*1) >= (value.quantity*1));
           if((value.tier_price.price*1) < (value.price*1) && (value.tier_price.price_qty*1) >= (value.quantity*1)){
            resolve(value.tier_price.price);
           }
           else{
            resolve(data.price);  
           }
       });
       });
   }
}
