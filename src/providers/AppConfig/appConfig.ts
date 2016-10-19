import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { ConfigDataType } from './../../pages/takeTour/configDataType';
import { Storage } from '@ionic/storage';
import keys from 'lodash/keys';
declare let Promise: any;
@Injectable()
export class AppConfig implements OnInit {
    store_id: string;
    webConfig: string;
    data: string;
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }
    getAppConfig(): Promise<ConfigDataType> {
        return this.local.get('web_config').then((value: any) => {
            this.webConfig = value;
            this.local.get('store_id').then((value: any) => {
                this.store_id = JSON.parse(value);
            });
        }).then(() => {
            if (keys(this.webConfig).length > 0) {
                return new Promise((resolve: any, reject: any) => resolve(this.webConfig));
            }
            else {
                let data = { store_id: this.store_id };
                return this._apiService.api("web/config", data).subscribe((res) => {
                    this.data = JSON.parse(res.body).data;
                    this.local.set('web_config', this.data);
                    return new Promise((resolve: any, reject: any) => resolve(this.data));
                })
            }
        })
    }
} 