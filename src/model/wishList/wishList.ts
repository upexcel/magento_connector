import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './../../providers/api-service/api-service';
// import { LoginDataType } from './../../pages/login/loginDataType';
declare let Promise: any;
@Injectable()
export class WishListModel implements OnInit {
    constructor(private _apiService: ApiService) {}
    ngOnInit() {}
    /**
    *getWishList
    *use to call account/getWishlist api
    **/
    getWishList(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api('account/getWishlist', data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    /**
    *addWishlist
    *use to call account/addWishlist api
    **/
    addWishlist(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api('account/addWishlist', data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
    /**
    *deleteWishlist
    *use to call account/removeWishlist api
    **/
    deleteWishlist(data) {
        return new Promise((resolve, reject) => {
            this._apiService.api('account/removeWishlist ', data).subscribe((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }
} 