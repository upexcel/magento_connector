import {Platform} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {GooglePlus, Facebook} from 'ionic-native'
import {config} from './../config/config';
declare let Promise: any;
@Injectable()
export class SocialService {
    options: any;
    constructor( public platform: Platform) {
        //comment because creating apply error on browserInit
        //        Facebook.browserInit(config.facebook_clientid, config.facebook_version);
        this.options = {
            webClientId: config.google_clientid
        }
    }

    fbLogin() {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                Facebook.login(['email']).then((success) => {
                    resolve(success);
                }).catch((res) => {
                    reject(res);
                })
            } else {
                reject('Please run me on a device');
            }
        });

    }

    getFbCurrentUserProfile() {
        return new Promise((resolve, reject) => {
            Facebook.api('/me?fields=id,first_name,last_name,email,picture.width(150).height(150)', null).then(
                (profileData) => {
                    resolve(profileData);
                }).catch((res) => {

                    reject(res);
                })
        });

    }
    googleLogin() {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                GooglePlus.login({
                    'scopes': '',
                    'webClientId': "",
                    'offline': true,
                }).then((success) => {
                    resolve(success);
                }).catch((res) => {
                    reject(res);
                })
            } else {
                reject('Please run me on a device');
            }
        });
    }
}
