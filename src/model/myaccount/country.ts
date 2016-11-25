import { Injectable} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
@Injectable()
export class Country {
    constructor(private _apiService: ApiService) { }
    getCountryName(){
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("web/getAllowedCountries", {}).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
