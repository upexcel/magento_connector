import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
<<<<<<< HEAD
import {ApiService } from './../../providers/api-service/api-service';
@Injectable()

export class homeProductsService {
    constructor(private _local: Storage, private _apiService: ApiService) {}
    getHomeProducts(data) {
        return new Promise((resolve, reject)=> {
=======
import { ApiService } from './../../providers/api-service/api-service';
@Injectable()

export class homeProductsService {
    constructor(private _local: Storage, private _apiService: ApiService) { }
    getHomeProducts(data) {
        return new Promise((resolve, reject) => {
>>>>>>> e74700487ce1a971c405f36905e0560abf701f5d
            this._apiService.api("home/products", data).subscribe((res) => {
                this._local.set('homeProducts', res);
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}