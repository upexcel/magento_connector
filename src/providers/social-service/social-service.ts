import { Platform} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {GooglePlus, Facebook} from 'ionic-native'
import { config} from './../config/config';
@Injectable()
export class SocialService {
    platform: any;
    options:any;
    constructor(platform: Platform) {
        this.platform = platform;
        Facebook.browserInit(1785639755024591, 'v2.8');
        this.options = {
            clientid: config.google_clientid
        }
    }

    login() {
        let p: any;
        p = new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                Facebook.login(['email']).then((success) => {
                    resolve(success);
                })
            } else {
                console.log("Please run me on a device");
                reject('Please run me on a device');
            }
        });
        return p;
    }

    getCurrentUserProfile() {
        let p: any;
        p = new Promise((resolve, reject) => {
            Facebook.api('/me?fields=id,first_name,last_name,email,picture.width(150).height(150)', null).then(
                (profileData) => {
                    resolve(profileData);
                });
        });
        return p;
    }
    google_login() {
        let p: any;
        p = new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                GooglePlus.login(this.options).then((success) => {
                    resolve(success);
                    console.log(success);
                })
            } else {
                console.log("Please run me on a device");
                reject('Please run me on a device');
            }
        });
        return p;
    }
    google_logout() {
        GooglePlus.logout();
    }
}

