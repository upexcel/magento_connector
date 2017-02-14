import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './../../providers/api-service/api-service';
//import {} from './';
declare let Promise: any;
@Injectable()
export class SortByModel implements OnInit {
    response: any;
    id;
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
    getSortData(data): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.id == data.id) {
                resolve(this.response);
            } else {
                this._apiService.api("category/sortby", data).subscribe((res: any) => {
                    this.id = data.id;
                    this.response = res.body;
                    resolve(res.body);
                }, (err) => {
                    reject(err);
                });
            }
        });
    }
}
