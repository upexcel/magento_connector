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

    getHomeProducts(data): Promise<HomeProductsDataType> {
        return new Promise((resolve, reject)=> {
            this.local.get('homeProducts').then((homeProducts: string) => {
                if (homeProducts != null && homeProducts != undefined){
                    resolve(homeProducts);
                }
                else {
                    this._homeProductsService.getHomeProducts(data).then((res)=> {
                        resolve(res);
                    }, (err)=>{
                        reject(err);
                    });
                }
            });
        });
    }
}
