import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { HomeProductsDataType } from './homeProductsDataType';
import { Storage } from '@ionic/storage';
declare let Promise: any;
@Injectable()
export class HomeProducts implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }

    getHomeProducts(): Promise<HomeProductsDataType> {
        let local = this.local;
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            local.get('homeProducts').then((homeProducts: string) => {
                if (homeProducts != null && homeProducts != undefined){
                    resolve(homeProducts);
                }
                else {
                        let data = { "type": "large_data" }
                        apiservice.api("home/products", data).subscribe((res) => {
                            local.set('homeProducts', res);
                            resolve(res);
                        }, (err) => {
                            reject(err);
                        });
                }
            });
        });
    }
}
