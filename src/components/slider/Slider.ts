import {Component, OnInit} from '@angular/core';
import {Slider} from '../../model/home/slider';
import {SliderDataType} from './../../model/home/sliderDataType';
import {config} from './../../providers/config/config';
@Component({
    selector: 'get-slider',
    templateUrl: 'slider.html'
})
export class SliderComponent implements OnInit {
    img: SliderDataType;//type checking
    mySlideOptions = config.homePageSliderOptions;
    constructor(private _sliderConfig: Slider) {
    }
    ngOnInit() {
        this.slider();
    }
    /*
    *slider()
    *calling service for get slider data
    */
    slider() {
        this._sliderConfig.getSlider().then((res) => {
            if (res) {
                this.img = res;
            }
        }, (err) => {
            console.log(err);
        });
    }
}