import { Injectable }    from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import { config} from './../config/config';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import {Subject} from 'rxjs/Rx';
@Injectable()
export class ApiService {
    constructor(private _local: Storage, private _http: Http) { }
    api(path, body) {
        var subject = new Subject();
        this._local.get('access_token').then((value) => {
            var self = this;
            let api_url = config.api_Url + path;
            let headers = new Headers({ 'Content-Type': config.content_type, 'APP_ID': config.APP_ID, 'Authorization': value });
            let options = new RequestOptions({ headers: headers });
            self._http.post(api_url, JSON.stringify(body), options)
                .subscribe((res:Response) => {
                    self._extractData(res,subject)
                },self._handleError)
        })
        return subject;

    }

    private _extractData(res, subject) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        subject.next(body)
        return body;
    }
    private _handleError(error: any) {
        let subject = new Subject();
        console.error('An error occurred', error);
        return subject.catch(error.message || error);
    }
}