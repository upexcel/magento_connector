import {Injectable} from '@angular/core';
import {HomeProductsDataType} from './homeProductsDataType';
import {Storage} from '@ionic/storage';
import {homeProductsService} from './../../providers/homeproducts-service/homeproducts.service';
declare let Promise: any;
@Injectable()
export class HomeProducts {
    constructor(public local: Storage, private _homeProductsService: homeProductsService) {}
    /**
    *getHomeProducts
    * call get home product service 
    **/
    getHomeProducts(data, recoll?): Promise<HomeProductsDataType> {
        return new Promise((resolve, reject) => {
            this.local.get('homeProducts').then((homeProducts: string) => {
                if (homeProducts != null && homeProducts != undefined && recoll != true) {
                    resolve(homeProducts);
                }
                else {
                    this._homeProductsService.getHomeProducts(data).then((res) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
}
