import {Injectable, OnInit} from '@angular/core';
import {SliderDataType} from './sliderDataType';
import {sliderService} from './../../providers/slider-service/slider.service';
declare let Promise: any;
@Injectable()
export class Slider implements OnInit {
    constructor(private _sliderService: sliderService) {}
    ngOnInit() {}
    getSlider(): Promise<SliderDataType> {
        return new Promise((resolve, reject) => {
            this._sliderService.getLocalSlider().then((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
