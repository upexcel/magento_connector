import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './../../providers/api-service/api-service';
//import {} from './';
declare let Promise: any;
@Injectable()
export class FilterByModel implements OnInit {
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
    getFilterData(data): Promise<any> {
        return new Promise((resolve, reject) => {
            this._apiService.api("category/filterby/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
