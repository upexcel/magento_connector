// this service is use in product page to get tier price 
import { Injectable } from '@angular/core'; 
import forEach from 'lodash/forEach';

@Injectable()
export class TierPrice {
    constructor() {
    }
 //function is used to get muntipul offer of tier price    
    getTierPriceData(data): any {  
        let finalprice = [];
            if (data.length > 0) {
                forEach(data, function(data, key1) {
                    finalprice.push({ tierPrice: data.price | 0 , price_qty: data.price_qty | 0 });
                });
            }
            return(finalprice);
    }
}
