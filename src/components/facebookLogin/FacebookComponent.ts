
import { Component, Output, EventEmitter } from '@angular/core';
import {SocialService} from '../../providers/social-service/social-service';
import {FacebookData} from './facebookData';
import {FacebookAuthResponse} from './facebookData';
import { Storage } from '@ionic/storage';
@Component({
    selector: 'facebook-login',
    template: `  <button ion-button color='primary' (click)="getFacebookData()" id="social">
                 <ion-icon name="logo-facebook"></ion-icon>Login with Facebook
                 </button>`
})
export class FacebookComponent {
    fb_data: FacebookData;
    fb_authRes: FacebookAuthResponse;
    @Output() userfbLogin: EventEmitter<any> = new EventEmitter();
    @Output() userfbError: EventEmitter<any> = new EventEmitter();
    constructor(public _local: Storage, private _socialProvider: SocialService) { }
    getFacebookData() {
        var self = this;
        this._socialProvider.fbLogin().then((res) => {
            this.fb_authRes = res;
            this._socialProvider.getFbCurrentUserProfile().then((profileData) => {
                this._local.get('website_id').then((website_id: string) => {
                    this.fb_data = profileData;
                    let body = { data: { social_id: this.fb_data.id, firstname: this.fb_data.first_name, lastname: this.fb_data.last_name, email: this.fb_data.email, picture: this.fb_data.picture.data.url, social: "facebook", website_id: website_id }, token: { access_token: this.fb_authRes.authResponse.accessToken } };
                    self.userfbLogin.emit(body);
                });
            });
        })
            .catch((err) => {
                self.userfbError.emit(err);
            });
    }
}