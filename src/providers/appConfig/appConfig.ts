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
                if (keys(web_config).length > 0) {
                    resolve(web_config);
                }
                else {
                    local.get('store_id').then((store_id: any) => {
                        let data = { store_id: JSON.parse(store_id) };
                        apiservice.api("web/config", data).subscribe((res) => {
                            let data = res.data;
                            local.set('web_config', data);
                            resolve(data);
                        }, (err) => {
                            reject(err);
                        });
                    });
                }

            });
        });
    }
}
