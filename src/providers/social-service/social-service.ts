import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { GooglePlus, Facebook } from 'ionic-native'
import { config } from './../config/config';
declare let Promise: any;
@Injectable()
export class SocialService {
    platform: any;
    options: any;
    constructor(platform: Platform) {
        this.platform = platform;
        Facebook.browserInit(config.facebook_clientid, config.facebook_version);
        this.options = {
            webClientId: config.google_clientid
        }
    }

    fbLogin() {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                Facebook.login(['email']).then((success) => {
                    resolve(success);
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
                });
        });

    }
    googleLogin() {
        console.log("googleLogin")
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                console.log("this.options", this.options)
                GooglePlus.login({
                    'scopes': '',
                    'webClientId': "1031859043774-igp8cfuhmbu0tfoc4fsoh7hsvhcesubc.apps.googleusercontent.com1031859043774-kqq13o4p0tu4etb7977ji042gf9sg071.apps.googleusercontent.com",
                    'offline': false,
                }).then((success) => {
                    console.log(success)
                    resolve(success);
                }).catch((res) => {
                    reject(res);
                    console.log("error", res)
                })
            } else {
                reject('Please run me on a device');
            }
        });
    }
}
