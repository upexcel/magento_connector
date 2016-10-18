import { Injectable, OnInit}    from '@angular/core';
import {ApiService } from './../../providers/api-service/api-service';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import keys from 'lodash/keys';
@Injectable()
export class AppConfig implements OnInit {
    data: any = {};
    store_id: string;
    constructor(public local: Storage, private _apiService: ApiService) { }
    ngOnInit() {
        this.local.get('store_id').then((value: any) => {
            this.store_id = JSON.parse(value);
        });
    }
    setData(): any {
        let body = { store_id: this.store_id };
        this._apiService.api("web/config", body).subscribe((res) => {
            this.data = JSON.parse(res.body).data;
        },
            (err) => {
                this.setData();
            }
        )
    }
    getAppConfig() {
        if ((keys(this.data).length > 0) && (this.data != undefined)) {
            return this.data;
        }
        else {
            return "";
        }
    }
}