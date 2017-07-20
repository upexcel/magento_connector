import {
    Injectable
} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';

@Injectable()
export class Country {
    countryName: object;
    constructor(private _apiService: ApiService) {}
    /**
*getCountryName
*use to call web/getAllowedCountries
**/
    getCountryName() {
        return new Promise((resolve, reject) => {
            if (!this.countryName) {
                this._apiService.api("web/getAllowedCountries", {}).subscribe((res) => {
                    this.countryName = res;
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            } else {
                resolve(this.countryName);
            }
        });
    }
}