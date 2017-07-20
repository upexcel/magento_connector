import {Injectable} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
import {ForgotDataType} from './forgotData';
@Injectable()
export class Forgot {
    constructor(private _apiService: ApiService) {}
    /**
    *getForgot
    *use to  call customer/forgot/
    **/
    getForgot(data): Promise<ForgotDataType> {
        return new Promise((resolve, reject) => {
            this._apiService.api("customer/forgot/", data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
}
