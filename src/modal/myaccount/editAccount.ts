import { Injectable} from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
@Injectable()
export class EditAccount {
    constructor(private _apiService: ApiService) { }
    updateAccount(data) {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("address/edit", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 