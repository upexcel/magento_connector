import { Injectable, OnInit } from '@angular/core';
import { ApiService } from './../../providers/api-service/api-service';
import { ConfigDataType } from './configDataType';
import { Storage } from '@ionic/storage';
import keys from 'lodash/keys';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
declare let Promise: any;
@Injectable()
export class AppConfig implements OnInit {
    constructor(public local: Storage, private _apiService: ApiService, private _appConfigService: AppDataConfigService) { }
    ngOnInit() { }

    getAppConfig(): Promise<ConfigDataType> {
        return new Promise((resolve, reject) => {
            this.local.get('web_config').then((web_config: string) => {
                if (keys(web_config).length > 0) {
                    resolve(web_config);
                }
                else {
                    this._apiService.api("web/config", {}).subscribe((res) => {
                        this._appConfigService.setWebConfig(res);
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
}
