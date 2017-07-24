import {Injectable, OnInit} from '@angular/core';
import {SliderDataType} from './sliderDataType';
import {Storage} from '@ionic/storage';
import keys from 'lodash/keys';
import {sliderService} from './../../providers/slider-service/slider.service';
declare let Promise: any;
@Injectable()
export class Slider implements OnInit {
    constructor(public local: Storage, private _sliderService: sliderService) {}
    ngOnInit() {}
    getSlider(): Promise<SliderDataType> {
        let local = this.local;
        return new Promise((resolve, reject) => {
            local.get('slider').then((slider: string) => {
                if (keys(slider).length > 0) {
                    resolve(slider);
                }
                else {
                    this._sliderService.getSlider().then((res) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
}
