import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import {notifyDatatype} from './notifyData';
declare let Promise: any;
@Injectable()
export class NotifyMe implements OnInit {
    constructor(private _apiService: ApiService) { }
    ngOnInit() { }
    setNotification(data):Promise<notifyDatatype> {
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            apiservice.api("product/productNotification", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
