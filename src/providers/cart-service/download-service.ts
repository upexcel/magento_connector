import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
declare let Promise: any;
@Injectable()
export class DownloadService {
    constructor(private _local: Storage) {
    }
    addCart(data): any {
        return new Promise((resolve, reject) => {
            this._local.get('item').then((value: any) => {

            });
        });
    }
}