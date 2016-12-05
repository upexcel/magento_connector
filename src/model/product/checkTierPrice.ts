// this service is use in product page to get tier price 
import { Injectable } from '@angular/core'; 
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
declare let Promise: any;
@Injectable()
export class TierPrice {
    constructor() {
    }
 //function is used to get muntipul offer of tier price    
    getTierPriceData(data): any {  
        let finalprice = [];
        return new Promise((resolve, reject) => {
            if (data.length > 0) {
                forEach(data, function(data, key1) {
                    finalprice.push({ tierPrice: data.price | 0 , price_qty: data.price_qty | 0 });
                });
            }
            resolve(finalprice);
        })
    }
}
