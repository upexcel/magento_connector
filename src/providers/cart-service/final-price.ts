// this service use to implement tire price in cart page 
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
declare let Promise: any;
@Injectable()
export class FinalPrice {
    constructor() {
    }
    //the getPrice funtion return all necessary data to be use in cart page  inclused additional attribute of tier_price 
    getPrice(data): any {
        let finalprice = [];
        return new Promise((resolve, reject) => {
            forEach(data, function(data, key1) {
                if (data.tier_price.length > 0) {
                    forEach(data.tier_price, function(tier_priceValue, key) {
                        if ((tier_priceValue.website_price * 1) < (data.price * 1) && (tier_priceValue.price_qty * 1) <= data.quantity) {
                            finalprice.push({ id: data.id, img: data.img, name: data.name, price: data.price, quantity: data.quantity, tier_price: data.tier_price, type: data.type, tPrice: tier_priceValue.website_price });
                        }
                        else {
                            finalprice.push({ id: data.id, img: data.img, name: data.name, price: data.price, quantity: data.quantity, tier_price: data.tier_price, type: data.type, tPrice: data.price });
                        }
                    })
                }
                else {
                    finalprice.push({ id: data.id, img: data.img, name: data.name, price: data.price, quantity: data.quantity, tier_price: data.tier_price, type: data.type, tPrice: data.price });

                }
            });
            resolve(finalprice);
        })
    }
}
