import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
@Injectable()

export class sliderService {
    slider: any;
    constructor(private _apiService: ApiService) {}
    resetSlider() {
        this.slider=[];
    }
    getLocalSlider() {
        return new Promise((resolve, reject) => {
            if (this.slider && this.slider.length > 0) {
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
    /**
    *getSlider function call home/slider api
    **/
    getSlider() {

    }
}