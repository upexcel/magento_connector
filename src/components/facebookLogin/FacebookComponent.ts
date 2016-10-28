import { NavController} from 'ionic-angular';
import { Component, Output, EventEmitter } from '@angular/core';
import {SocialService} from '../../providers/social-service/social-service';
import {FacebookData} from './facebookData';
import {FacebookAuthResponse} from './facebookData';
@Component({
    selector: 'facebook-login',
    template: `  <button ion-button color='primary' (click)="getFacebookData()" id="social">
                 <ion-icon name="logo-facebook"></ion-icon>Login with Facebook
                 </button>`
})
export class FacebookComponent {
    fb_data: FacebookData;
    fb_authRes:FacebookAuthResponse;
    @Output() userfbLogin: EventEmitter<any> = new EventEmitter();
    @Output() userfbError: EventEmitter<any> = new EventEmitter();
    constructor(private _socialProvider: SocialService) { }
    getFacebookData() {
        var self = this;
        this._socialProvider.fbLogin().then((res) => {
          this.fb_authRes=res;
            this._socialProvider.getFbCurrentUserProfile().then((profileData) =>
                 {
                   this.fb_data = profileData;
                    let body = { firstname: this.fb_data.first_name, lastname: this.fb_data.last_name, email: this.fb_data.email, picture: this.fb_data.picture.data.url,access_token:this.fb_authRes.authResponse.accessToken };
                    self.userfbLogin.emit(body);
                })
        })
            .catch((err) => {
                self.userfbError.emit(err);
            });
    }
}
