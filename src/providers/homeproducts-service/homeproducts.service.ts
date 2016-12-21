import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import { ApiService } from './../../providers/api-service/api-service';
@Injectable()

export class homeProductsService {
    constructor(private _local: Storage, private _apiService: ApiService) { }
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
}