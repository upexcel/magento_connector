import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
declare let Promise: any;
@Injectable()
export class FinalPrice {
    constructor() {
    }
    getPrice(data): any {
        console.log(data)
        let finalprice = [];
        return new Promise((resolve, reject) => {
            forEach(data, function(data, key1) {
                console.log("enter loop")
                console.log(data.tier_price.length)
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
