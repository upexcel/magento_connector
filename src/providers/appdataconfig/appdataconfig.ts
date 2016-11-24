import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import {config} from './../../providers/config/config';
import { categoryService } from './../../providers/category-service/category-service';
import { homeProductsService } from './../../providers/homeproducts-service/homeproducts.service';
import { sliderService } from './../../providers/slider-service/slider.service';

@Injectable()

export class AppDataConfigService {
    constructor(private _local: Storage, private _categoryService: categoryService, private _homeProductsService: homeProductsService, private _sliderService: sliderService, ) {}
    setUserData(userData) {
        this.cleanUp();
        this._local.set('userData', userData);
    }
    getUserData() {
        return new Promise((resolve, reject)=> {
        this.cleanUp();
        this._local.get('userData').then((userData)=>{
           resolve(userData);
       });
       });
   }
    setWebConfig(data) {
        this.cleanUp();
        this._local.set('web_config', data);
        this._local.set('app_data_expire', new Date().getTime() + config.appDataTime);
    }
    cleanUp () {
        this._local.get("app_data_expire").then((expireTime)=>{
            if(new Date().getTime() > expireTime){
                this._homeProductsService.getHomeProducts();
                this._categoryService.getCategoryList();
                this._sliderService.getSlider();
                this._local.set('app_data_expire', new Date().getTime() + config.appDataTime);
            }
        });
	};
}