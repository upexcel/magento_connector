import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
//import {} from './';
declare let Promise: any;
@Injectable()
export class SortByModel implements OnInit {
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
    getSortData(sku,userEmail):Promise<any> {
        let data={sku:sku,email:userEmail}
        return new Promise((resolve, reject)=> {
            this._apiService.api("category/sortby", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
