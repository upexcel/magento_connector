import {
    Injectable
} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import forEach from 'lodash/forEach';
@Injectable()

export class HomeProducts {
    homeProduct;
    constructor( private _apiService: ApiService) {}
    resetHomeProducts() {
        this.homeProduct=null;
    }
    /**
    * getHomeProducts function is use for call home/products api 
    **/
    getHomeProducts(data) {
        return new Promise((resolve, reject) => {
            if ((this.homeProduct && !this.homeProduct.body) || !this.homeProduct) {
                this._apiService.api("home/products", data).subscribe((res) => {
                    this.homeProduct = res;
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            } else {
                resolve(this.homeProduct)
            }
        });
    }
    updateHomeProductWishlist(entity_id, wishlist_id) {
        let homeProductsData = this.homeProduct;
        forEach(homeProductsData['body'], (value, key) => {
            if (value['data']['entity_id'] == entity_id) {
                value['data']['wishlist_item_id'] = wishlist_id;
            }
        });
    }
}