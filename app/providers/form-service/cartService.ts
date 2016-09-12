import { Injectable }    from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import * as _ from 'lodash';

import {Observable}     from 'rxjs/Observable';
import { config } from './../config/config'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TotalService {
    constructor() {
    }

    getTotal(data: any) {
        var total = 0;
        _.forEach(data, function(value1, key) {
            let v = _.replace(value1.price, '$', ' ');
            total = parseInt(value1.no) * parseInt(v) + total;
        });
        return Promise.resolve(total);
    }
    qetQuentity(data, value) {
        var cartData = [];
        var v;
        cartData = JSON.parse(localStorage.getItem('item'));
        if (cartData && cartData.length > 0) {
            _.forEach(cartData, function(value, key) {
                //increse count in cartitem for that item only
                if (data.sku == value.id) {
                    v = parseInt(data.qty) - value.no;
                }
            });
            if (v > 0) {
                return Promise.resolve(v);
            }
            else {
                v = 0;
                return Promise.resolve(v);
            }

        }

        else {
            cartData = [];
            return Promise.resolve(data.qty);
        }
    }

    addCart(data) {
        var cartData = [];
        var count = 0;
        cartData = JSON.parse(localStorage.getItem('item'));
        //if local saved data found
        if (cartData) {
            //local/cartdata is not null
            if (cartData && cartData.length > 0) {
                //iterate cartdata and if ned aded item has same id and size
                _.forEach(cartData, function(value, key) {
                    //increse count in cartitem for that item only
                    if (data.id == value.id && data.size == value.size) {
                        value.no = parseInt(value.no) + parseInt(data.no);
                        count = 1;
                    }
                    //else push has new item 
                    else {
                        //                        count = 1;
                    }
                });
                if (count != 1) {
                    if (data.no == 0) {

                    } else {
                        cartData.push(data);
                    }
                }
                else {

                }
            }
            //if local is set to null
            else {
                if (data.no == 0) {

                } else {
                    cartData.push(data);
                }
            }
        }
        //if no pre saved data
        else {
            cartData = [];
            if (data.no == 0) {

            } else {
                cartData.push(data);
            }
        }

        localStorage.setItem('item', JSON.stringify(cartData));
        return Promise.resolve(cartData);
    }

}