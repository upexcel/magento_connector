import { Injectable }    from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import { config, config2 } from './../config/config'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FormService {
    constructor(private _http: Http) { }
    access_token = localStorage.getItem('access_token');

    api(url: any, body: any) {
        let api_url = config2 + url   //complete api url 
        let headers = new Headers({ 'Content-Type': 'application/json', 'APP_ID': 'com.tethr', 'Authorization': this.access_token });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(api_url, JSON.stringify(body), options)
            .map(this._extractData)
            .catch(this._handleError);
    }
    social_auth(url: any, body: any) {
        let api_url = config + url   //complete api url 
        let headers = new Headers({ 'Content-Type': 'application/json', 'APP_ID': 'com.tethr', 'Authorization': this.access_token });
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