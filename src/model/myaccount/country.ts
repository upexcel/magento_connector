import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import { ApiService } from './../../providers/api-service/api-service';

@Injectable()

export class Country {
    constructor(private _local: Storage, private _apiService: ApiService) {}
    getCountryName(){
        return new Promise((resolve, reject)=> {
            this._apiService.api("web/getAllowedCountries", {}).subscribe((res) => {
                this._local.set('countryName', res);
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}