import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { HomeProductsDataType } from './homeProductsDataType';
import { Storage } from '@ionic/storage';
import { homeProductsService } from './../../providers/homeproducts-service/homeproducts.service';
declare let Promise: any;
@Injectable()
export class HomeProducts implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService, private _homeProductsService: homeProductsService) { }
    ngOnInit() { }

    getHomeProducts(): Promise<HomeProductsDataType> {
        let local = this.local;
        let apiservice = this._apiService;
        return new Promise((resolve, reject)=> {
            local.get('homeProducts').then((homeProducts: string) => {
                if (homeProducts != null && homeProducts != undefined){
                    resolve(homeProducts);
                }
                else {
                    this._homeProductsService.getHomeProducts().then((res)=> {
                        resolve(res);
                    }, (err)=>{
                        reject(err);
                    });
                }
            });
        });
    }
}
