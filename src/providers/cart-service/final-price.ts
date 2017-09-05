// this service use to implement tire price in cart page 
import {Injectable} from '@angular/core';
import forEach from 'lodash/forEach';

@Injectable()
export class FinalPrice {
    constructor() {
    }
    //the getPrice funtion return all necessary data to be use in cart page  inclused additional attribute of tier_price 
    getPrice(data): any {
        let finalprice = [];
        forEach(data, (data, key1) => {
            if (data.tier_price.length > 0) {
                forEach(data.tier_price, (tier_priceValue, key) => {
                    if ((parseFloat(tier_priceValue.website_price)) < (parseFloat(data.price)) && (parseFloat(tier_priceValue.price_qty)) <= data.quantity) {
                        finalprice.push({id: data.id, img: data.img, name: data.name, price: data.price, quantity: data.quantity, tier_price: data.tier_price, type: data.type, tPrice: tier_priceValue.website_price});
                    }
                    else {
                        finalprice.push({id: data.id, img: data.img, name: data.name, price: data.price, quantity: data.quantity, tier_price: data.tier_price, type: data.type, tPrice: data.price});
                    }
                })
            }
            else {
                finalprice.push({id: data.id, img: data.img, name: data.name, price: data.price, quantity: data.quantity, tier_price: data.tier_price, type: data.type, tPrice: data.price});

            }
        });
        return (finalprice);
    }
}
