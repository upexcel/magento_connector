import { Injectable }    from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { config} from './../config/config';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import {Subject} from 'rxjs/Rx';
import {Platform} from 'ionic-angular';
@Injectable()
export class ApiService {
    constructor(private _local: Storage, private _http: Http, private _platform: Platform) { }
    api(path, body) {
        var subject = new Subject();
        this._local.get('userData').then((userData) => {
            var self = this;
            var headers;
            body.mobile_width = this._platform.width();
            let api_url = config.api_Url + path;

            if (userData !== null) {
                headers = new Headers({ 'Content-Type': config.content_type, 'APP_ID': config.APP_ID, 'Authorization': userData.access_token });
            } else {
                headers = new Headers({ 'Content-Type': config.content_type, 'APP_ID': config.APP_ID });
            }
            let options = new RequestOptions({ headers: headers });
            self._http.post(api_url, JSON.stringify(body), options)
                .subscribe((res: Response) => {
                    self._extractData(res, subject)
                },

                (error) => {
                    self._handleError(error, subject)
                })
        });
        return subject;
    }
    private _extractData(res, subject) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = JSON.parse(res.json().body);
        subject.next(body);
        return body;
    }

    private _handleError(error, subject) {
        return subject.error(error.message || error);
    }
}
