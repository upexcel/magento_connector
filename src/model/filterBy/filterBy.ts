import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './../../providers/api-service/api-service';
declare let Promise: any;
@Injectable()
export class FilterByModel implements OnInit {
    response: any;
    id;
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
    getFilterData(data): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.id == data.id || data.coll != 0) {
                resolve(this.response);
            } else {
                this.response = "";
                this._apiService.api("category/filterby/", data).subscribe((res: any) => {
                    this.id = data.id;
                    this.response = res.body.data;
                    resolve(res.body.data);
                }, (err) => {
                    reject(err);
                });
            }
        });
    }
}
