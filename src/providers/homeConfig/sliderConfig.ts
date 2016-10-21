import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {SliderConfigDataType  } from './../../pages/home/sliderConfigDataType';
import { Storage } from '@ionic/storage';
import keys from 'lodash/keys';
declare let Promise: any;
@Injectable()
export class SliderConfig implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }
    getSliderConfig(): Promise<SliderConfigDataType> {
        let local = this.local;
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            local.get('slider').then((slider: string) => {
                if (keys(slider).length > 0) {
                    resolve(slider);
                }
                else {
                    apiservice.api("home/slider", {}).subscribe((res) => {
                        local.set('slider', res);
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
}
