import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import {ApiService} from './../../providers/api-service/api-service';
import forEach from 'lodash/forEach';
@Injectable()

export class homeProductsService {
    constructor(private _local: Storage, private _apiService: ApiService) {}
    getHomeProducts(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api("home/products", data).subscribe((res) => {
                this._local.set('homeProducts', res);
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    updateHomeProductWishlist(entity_id, wishlist_id) {
        this._local.get('homeProducts').then((homeProductsData)=>{
            forEach(homeProductsData['body'], (value, key) => {
                if(value['data']['entity_id'] == entity_id){
                    value['data']['wishlist_item_id'] = wishlist_id;
                }
            })
            this._local.set('homeProducts', homeProductsData);
        });
    }
}