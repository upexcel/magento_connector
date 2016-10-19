import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { ConfigDataType } from './../../pages/takeTour/configDataType';
import { Storage } from '@ionic/storage';
import keys from 'lodash/keys';
declare let Promise: any;
@Injectable()
export class AppConfig implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() { }

    getAppConfig(): Promise<ConfigDataType> {
        let local = this.local;
        let apiservice = this._apiService;
        return new Promise(function(resolve, reject) {
            local.get('web_config').then((web_config: string) => {
                local.get('store_id').then((store_id: any) => {
                    let data = { store_id: JSON.parse(store_id) };
                    if (keys(web_config).length > 0) {
                        resolve(web_config);
                    }
                    else {
                        apiservice.api("web/confi", data).subscribe((res) => {
                            let data = JSON.parse(res.body).data;
                            local.set('web_config', data);
                            resolve(data);
                        })
                    }
                });
            });
        }).catch(function(reason) {
            // not called
        }, function(reason) {
            console.log(reason); 
        });
    }
} 