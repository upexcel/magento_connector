import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import {ApiService } from './../../providers/api-service/api-service';

@Injectable()

export class AppDataConfigService {
    constructor(private _local: Storage, private _apiService: ApiService) {}
    setUserData(userData) {
        this.cleanUp();
        this._local.set('userData', userData);
    }
    setWeb_config(data) {
        this.cleanUp();
        this._local.set('web_config', data);
        this._local.set('web_config_expire', new Date().getTime() + 86400000);
    }
    cleanUp () {
        this._local.get("web_config_expire").then((expireTime)=>{
            if(new Date().getTime() > expireTime){
                this.updateAppCategory();
                this.updateAppHomeProducts();
                this.updateAppSlider();
                this._local.set('web_config_expire', new Date().getTime() + 86400000);
            }
        });
	};
    updateAppCategory (){
        this._local.get('store_id').then((store_id: any) => {
            let data = { "parent_id": "1", "type": "full", "store_id": store_id }
            this._apiService.api("category/categorylist/", data).subscribe((res) => {
                this._local.set('categorylist', res);
            }, (err) => {
            });
        });
    }
    updateAppHomeProducts (){
        let data = { "type": "large_data" }
        this._apiService.api("home/products", data).subscribe((res) => {
            this._local.set('homeProducts', res);
        }, (err) => {
        });
    }
    updateAppSlider (){
        this._apiService.api("home/slider", {}).subscribe((res) => {
            this._local.set('slider', res);
        }, (err) => {
        });
    }
}