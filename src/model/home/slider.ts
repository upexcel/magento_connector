import {Injectable} from '@angular/core';
import {SliderDataType} from './sliderDataType';
import {ApiService} from './../../providers/api-service/api-service';
declare let Promise: any;
@Injectable()
export class Slider {
    slider: any;
    constructor(private _apiService: ApiService) {}
    resetSlider() {
        this.slider = null;
    }
    getSlider(): Promise<SliderDataType> {
        return new Promise((resolve, reject) => {
            if ( this.slider && this.slider.body) {
                resolve(this.slider);
            } else {
                this.slider;
                this._apiService.api("home/slider", {}).subscribe((res) => {
                    this.slider = res;
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }

        });
    }

}
