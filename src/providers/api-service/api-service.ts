import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { config } from './../config/config';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import { Subject } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';
import { ToastService } from './../../providers/toast-service/toastService';
@Injectable()
export class ApiService {
    constructor(private _toast: ToastService, private _local: Storage, private _http: Http, private _platform: Platform) { }
    api(path, body) {
        var subject = new Subject();
        this._local.get('userData').then((userData) => {
            var self = this;
            var headers;
            body.mobile_width = this._platform.width();
//            body.mobile_width=420;
            let api_url = config.api_Url + path;

            if (userData !== null) {
                headers = new Headers({ 'Content-Type': config.content_type, 'APP_ID': config.APP_ID, 'Authorization': userData.access_token });
            } else {
                headers = new Headers({ 'Content-Type': config.content_type, 'APP_ID': config.APP_ID });
            }
            let options = new RequestOptions({ headers: headers });
            self._http.post(api_url, JSON.stringify(body), options)
                .timeout(config.stopApiTime, new Error('Check Network Connection'))
                .subscribe((res: Response) => {
                    self._extractData(res, subject)
                },

                (error) => {
                    this._toast.toast(error, 3000);
                    self._handleError(error, subject)
                })
        });
        return subject;
    }
    private _extractData(res, subject) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        subject.next(res.json());
        if (res.json().status != 0) {
            return res.json();
        }

    }

    private _handleError(error, subject) {
        return subject.error(error.message || error);
    }
}
