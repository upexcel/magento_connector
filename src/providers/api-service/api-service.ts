import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {config} from './../config/config';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import {Subject} from 'rxjs/Rx';
import {Platform} from 'ionic-angular';
import {ToastService} from './../../providers/toast-service/toastService';
import {StartPage} from './../../pages/startpage/startpage';

@Injectable()
/**
*this service is ues to fire api 
**/
export class ApiService {
    nav: any;
    constructor(private _toast: ToastService, private _local: Storage, private _http: Http, private _platform: Platform) {}
    api(path, body) {
        var subject = new Subject();
        this._local.get('userData').then((userData) => {
            this._local.get('store_id').then((store_id: any) => {
                var headers;
                body.mobile_width = this._platform.width();
                body['secret'] = userData ? userData['secret'] : "";
                body['store_id'] = store_id ? store_id : "";
                //            body.mobile_width=420;
                let api_url = config.api_Url + path;
                if (userData !== null) {
                    headers = new Headers({'Content-Type': config.content_type, 'APP_ID': config.APP_ID, 'Authorization': userData.access_token});
                } else {
                    headers = new Headers({'Content-Type': config.content_type, 'APP_ID': config.APP_ID});
                }
                let options = new RequestOptions({headers: headers});
                this._http.post(api_url, JSON.stringify(body), options)
                    //                    .timeout(config.stopApiTime, new Error('Check Network Connection'))
                    .subscribe((res: Response) => {
                        this._extractData(res, subject)
                    },

                    (error) => {
                        if (error._body && typeof error._body !== 'object') {
                            if (JSON.parse(error._body).message == 'Token Not Found') {
                                this.logout();
                            }
                            //                            this._toast.toast(JSON.parse(error._body).message, 3000);
                            //                        } else if (error.message) {
                            //                            this._toast.toast(error.message, 3000);
                            //                        } else {
                            //                            this._toast.toast(error, 3000);
                            //                        }
                        }
                        this._handleError(error, subject)
                    })

            });
        });
        return subject;
    }
    setNavControllerForService(nav) {
        this.nav = nav;
    }
    logout() {
        this._local.clear();
        this.nav.setRoot(StartPage, {"message": "please Login Again"});
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
