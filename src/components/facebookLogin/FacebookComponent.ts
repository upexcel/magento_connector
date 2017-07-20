
import {Component, Output, EventEmitter} from '@angular/core';
import {SocialService} from '../../providers/social-service/social-service';
import {FacebookData} from './facebookData';
import {FacebookAuthResponse} from './facebookData';
import {Storage} from '@ionic/storage';
import {ToastService} from './../../providers/toast-service/toastService';

@Component({
    selector: 'facebook-login',
    template: `  <button ion-button class="fb socialButton" (tap)="getFacebookData()" id="social">
                 <ion-icon name="logo-facebook"></ion-icon>Login with Facebook <ion-spinner *ngIf="spin" class="spin">
            </ion-spinner>          
                 </button>`
})
export class FacebookComponent {
    fb_data: FacebookData;
    fb_authRes: FacebookAuthResponse;
    spin = false;
    @Output() userfbLogin: EventEmitter<any> = new EventEmitter();
    @Output() userfbError: EventEmitter<any> = new EventEmitter();
    constructor(public _local: Storage, private _socialProvider: SocialService, private _toast: ToastService) {}
    /** 
*    getFacebookData
* function ues for get facebook data
**/
    getFacebookData() {
        if (this.spin == false) {
            this.spin = true;
            let error;
            this._socialProvider.fbLogin().then((res) => {
                this.spin = false;
                this.fb_authRes = res;
                this._socialProvider.getFbCurrentUserProfile().then((profileData) => {
                    this._local.get('website_id').then((website_id: string) => {
                        this.fb_data = profileData;
                        setTimeout(() => {
                            this._toast.toast("Welcome " + this.fb_data.first_name, 3000);
                        }, 3000)
                        let body = {data: {social_id: this.fb_data.id, firstname: this.fb_data.first_name, lastname: this.fb_data.last_name, email: this.fb_data.email, picture: this.fb_data.picture.data.url, social: "facebook", website_id: website_id}, token: {access_token: this.fb_authRes.authResponse.accessToken}};
                        this.userfbLogin.emit(body);
                    });
                }, (err) => {
                    this.spin = false;
                    error = err;
                });
            }, (err) => {
                this.spin = false;
                error = err;
            });

            if (error) {
                this.userfbError.emit(error);
            }
        }
    }
}