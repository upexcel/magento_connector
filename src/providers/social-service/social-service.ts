import { Platform} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {GooglePlus, Facebook} from 'ionic-native'
import { config} from './../config/config';
@Injectable()
export class SocialService {
    platform: any;
    options: any;
    constructor(platform: Platform) {
        this.platform = platform;
        Facebook.browserInit(config.facebook_clientid, config.facebook_version);
        this.options = {
            clientid: config.google_clientid
        }
    }

    fbLogin() {
        let p = new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                Facebook.login(['email']).then((success) => {
                    resolve(success);
                })
            } else {
                reject('Please run me on a device');
            }
        });
        return p;
    }

    getFbCurrentUserProfile() {
        let p = new Promise((resolve, reject) => {
            Facebook.api('/me?fields=id,first_name,last_name,email,picture.width(150).height(150)', null).then(
                (profileData) => {
                    resolve(profileData);
                });
        });
        return p;
    }
    googleLogin() {
        let p = new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                GooglePlus.login(this.options).then((success) => {
                    resolve(success);
                })
            } else {
                reject('Please run me on a device');
            }
        });
        return p;
    }
}
