import {
    Injectable
} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import forEach from 'lodash/forEach';
import {Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';

@Injectable()

export class HomeProducts {
    data: any;
    constructor(public local: Storage, public events: Events, private _apiService: ApiService) {}
    resetHomeProducts() {
        this.local.remove('homeProduct');
        this.data = null;
    }
    /**
    * getHomeProducts function is use for call home/products api 
    **/
    getHomeProducts() {
        console.log("call**")
        let data = {"type": "full"}
        return new Promise((resolve, reject) => {
            this.local.get('homeProduct').then((homeProduct) => {
                this.data = homeProduct;
                if ((homeProduct && !homeProduct.body) || !homeProduct) {
                    this._apiService.api("home/products", data).subscribe((res) => {
                        this.data = res;
                        this.local.set('homeProduct', res);
                        this.events.publish('homeProducts:api', "true");
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    resolve(homeProduct)
                }
            });
        });
    }
    getData() {
        return new Promise((resolve, reject) => {
            resolve(this.data);
        })
    }
    updateHomeProductWishlist(entity_id, wishlist_id) {
        this.local.get('homeProduct').then((homeProduct) => {
            let homeProductsData = homeProduct;
            forEach(homeProductsData['body'], (value, key) => {
                if (value['data']['entity_id'] == entity_id) {
                    value['data']['wishlist_item_id'] = wishlist_id;
                }
            });
            this.data = homeProductsData;
            this.local.set('homeProduct', homeProductsData);
            this.events.publish('homeProducts:api', "true");
        });
    }
}