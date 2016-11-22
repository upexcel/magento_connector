import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import { ApiService } from './../../providers/api-service/api-service';
import { SliderDataType  } from './../../model/home/sliderDataType';

@Injectable()

export class sliderService {
    constructor(private _local: Storage, private _apiService: ApiService) {}
    getSlider(): Promise<SliderDataType> {
        return new Promise((resolve, reject)=> {
            this._apiService.api("home/slider", {}).subscribe((res) => {
                this._local.set('slider', res);
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}