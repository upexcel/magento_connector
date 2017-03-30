import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import {config} from './../../providers/config/config';
import {categoryService} from './../../providers/category-service/category-service';
import {homeProductsService} from './../../providers/homeproducts-service/homeproducts.service';
import {sliderService} from './../../providers/slider-service/slider.service';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
@Injectable()

export class AppDataConfigService {
    appTemporaryData:any;
    constructor(private _local: Storage, private _categoryService: categoryService, private _homeProductsService: homeProductsService, private _sliderService: sliderService, ) {
        this.appTemporaryData = [];
    }
    setUserData(userData) {
        this.cleanUp();
        this._local.set('userData', userData);
    }
    getUserData() {
        return new Promise((resolve, reject) => {
            this.cleanUp();
            this._local.get('userData').then((userData) => {
                resolve(userData);
            });
        });
    }
    setWebConfig(data) {
        this.cleanUp();
        this._local.set('web_config', data);
        this._local.set('app_data_expire', new Date().getTime() + config.appDataTime);
    }
    cleanUp() {
        let body = {"type": "full"}
        this._local.get("app_data_expire").then((expireTime) => {
            if (new Date().getTime() > expireTime) {
                this._homeProductsService.getHomeProducts(body);
                this._categoryService.getCategoryList();
                this._sliderService.getSlider();
                this._local.set('app_data_expire', new Date().getTime() + config.appDataTime);
            }
        });
    };
    removeFromLocalStorage(key) {
        return new Promise((resolve, reject) => {
            this._local.remove(key);
            resolve();
        })
    };
    saveDataInService(apiData, responseData) {
        this.appTemporaryData.push(
        {
            "apiData":apiData,
            "responseData":responseData
        });
    };
    checkDataInService(apiData) {
        delete apiData.mobile_width;
            let flag = 0;
            let responseData;
            forEach(this.appTemporaryData, (value, key) => {
                delete value['apiData'].mobile_width;
                if (isEqual(apiData, value.apiData)) {
                    responseData = value['responseData'];
                    flag = 1;
                }
            });
            if (flag == 1) {
                return responseData;
            } else{
                return false;
            }
    };
}