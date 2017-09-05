import {
    Injectable
} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';

@Injectable()
export class Country {
    constructor(private _appConfigService: AppDataConfigService, private _apiService: ApiService) {}
    /**
*getCountryName
*use to call web/getAllowedCountries
**/
    getCountryName() {
        return new Promise((resolve, reject) => {
            this._appConfigService.getCountry().then((countryName) => {
                if (!countryName) {
                    this._apiService.api("web/getAllowedCountries", {}).subscribe((res) => {
                        this._appConfigService.setCountry(res);
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    resolve(countryName);
                }
            })
        });
    }
}