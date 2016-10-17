import { Injectable, OnInit}    from '@angular/core';
import {FormService } from './../form-service/form-service';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import keys from 'lodash/keys';
@Injectable()
export class TourService implements OnInit {
    data: any= { };
    store_id: string;
    constructor(public local: Storage, public _formService: FormService) { }

    ngOnInit() {
        this.local.get('store_id').then((value: any) => {
            this.store_id = JSON.parse(value);
        });
    }
    getData() {
        let body = { store_id: this.store_id };
        this._formService.api("web/config", body).subscribe((res) => {
            this.data = JSON.parse(res.body).data;
            return new Promise((resolve: any, reject: any) => resolve(this.data));
        })
    }
    setData() {
    if((keys(this.data).length>0) && (this.data != undefined)){
        return this.data;
    }
    else{
        return "";
    }
    }
}