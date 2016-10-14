import { Injectable }    from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import { config} from './../config/config';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FormService {
    access_token: string;
    constructor(public local: Storage, private _http: Http) {
    }
    api(path: any, body: any) {
        this.local.get('access_token').then((value: any) => {
            this.access_token = value;
        });
        let api_url = config.api_Url + path;
        let headers = new Headers({ 'Content-Type': 'application/json', 'APP_ID': config.APP_ID, 'Authorization': this.access_token });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(api_url, JSON.stringify(body), options)
            .map(this._extractData)
            .catch(this._handleError);
    }

    private _extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body;
    }
    private _handleError(error: any) {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
    }
}