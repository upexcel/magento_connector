import {Injectable} from '@angular/core';
import {SliderDataType} from './sliderDataType';
import {ApiService} from './../../providers/api-service/api-service';
declare let Promise: any;
import {Storage} from '@ionic/storage';

@Injectable()
export class Slider {
    constructor(public local: Storage, private _apiService: ApiService) {}
    resetSlider() {
        this.local.remove('slider');
    }
    getSlider(): Promise<SliderDataType> {
        return new Promise((resolve, reject) => {
            this.local.get('slider').then((slider) => {
                if (slider && slider.body) {
                    resolve(slider);
                } else {
                    this._apiService.api("home/slider", {}).subscribe((res) => {
                        this.local.set('slider', res);
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }

}
