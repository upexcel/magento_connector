import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {config} from './../../providers/config/config';
import {Slider} from './../../model/home/slider';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
@Injectable()

export class AppDataConfigService {
    appTemporaryData: any;
    constructor(public _local: Storage, private _sliderService: Slider ) {
        this.appTemporaryData = [];
    }
    setUserData(userData) {
        this.cleanUp();
        this._local.set('userData', userData); //set user data to local storage
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
        this._local.get("app_data_expire").then((expireTime) => {
            if (new Date().getTime() > expireTime) {
                this._sliderService.resetSlider();
                this._local.remove("web_config");
                this._local.remove("app_data_expire");
                this._local.remove("require_login");
                this._local.remove("website_id");
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
                "apiData": apiData,
                "responseData": responseData
            });
    };
    resetDataInService() {
        this.appTemporaryData = [];
    };
    checkDataInService(apiData) {
        delete apiData.mobile_width;
        delete apiData.secret;
        delete apiData.store_id;
        let flag = 0;
        let responseData;
        forEach(this.appTemporaryData, (value, key) => {
            delete value['apiData'].mobile_width;
            delete value['apiData'].secret;
            delete value['apiData'].store_id;
            if (isEqual(apiData, value.apiData)) {
                responseData = value['responseData'];
                flag = 1;
            }
        });
        if (flag == 1) {
            return responseData;
        } else {
            return false;
        }
    };
    updateDataInServiceForWishlist(entity_id, wishlist_id) {
        forEach(this.appTemporaryData, (value) => {
            if (value['responseData']['body'].length) {
                forEach(value['responseData']['body'], (categoryData) => {
                    if (entity_id == categoryData['data']['entity_id']) {
                        categoryData['data']['wishlist_item_id'] = wishlist_id;
                    }
                });
            } else {
                if (entity_id == value['responseData']['body']['data']['entity_id']) {
                    value['responseData']['body']['data']['wishlist_item_id'] = wishlist_id;
                }
            }
        });
    };
}