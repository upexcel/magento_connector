
import {Component, Output, EventEmitter, Input} from '@angular/core';
import {SocialService} from '../../providers/social-service/social-service';
import {FacebookData} from './facebookData';
import {FacebookAuthResponse} from './facebookData';
import {Storage} from '@ionic/storage';
import {ToastService} from './../../providers/toast-service/toastService';
import {LoadingController} from 'ionic-angular';
import {LoaderProvider} from './../../providers/loader/loader'

@Component({
    selector: 'facebook-login',
    template: `  <button ion-button class="fb socialButton" (click)="getFacebookData()" id="social">
                 <ion-icon name="logo-facebook"></ion-icon>Login with Facebook <ion-spinner *ngIf="spin" class="spin">
            </ion-spinner>          
                 </button>`
})
export class FacebookComponent {
    fb_data: FacebookData;
    fb_authRes: FacebookAuthResponse;
    spin = false;
    @Input() spinEvent: any;
    @Output() userfbLogin: EventEmitter<any> = new EventEmitter();
    @Output() userfbError: EventEmitter<any> = new EventEmitter();
    constructor(private _loading: LoaderProvider, public loadingCtrl: LoadingController, public _local: Storage, private _socialProvider: SocialService, private _toast: ToastService) {
        setTimeout(() => {
            if (this.spinEvent != 1) {
                this.spin = this.spinEvent;
                this._loading.getLoderReference().dismiss();
                this._loading.clearReference();
            }
        }, 200)
    }
    /** 
*    getFacebookData
* function ues for get facebook data
**/
    getFacebookData() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        setTimeout(() => {
            this._loading.setLoderReference(loading);
        }, 100)
        if (this.spin == false) {
            this.spin = true;
            loading.present();
            let error;
            this._socialProvider.fbLogin().then((res) => {
                this.fb_authRes = res;
                this._socialProvider.getFbCurrentUserProfile().then((profileData) => {
                    this._local.get('website_id').then((website_id: string) => {
                        this.fb_data = profileData;
                        let body = {data: {social_id: this.fb_data.id, firstname: this.fb_data.first_name, lastname: this.fb_data.last_name, email: this.fb_data.email, picture: this.fb_data.picture.data.url, social: "facebook", website_id: website_id}, token: {access_token: this.fb_authRes.authResponse.accessToken}};
                        this.userfbLogin.emit(body);
                    });
                }, (err) => {
                    this.spin = false;
                    error = err;
                    loading.dismiss();
                    this._loading.clearReference();
                });
            }, (err) => {
                this.spin = false;
                error = err;
                loading.dismiss();
                this._loading.clearReference();
            });

            if (error) {
                loading.dismiss();
                this._loading.clearReference();
                this.spin = false;
                this.userfbError.emit(error);
            }
        }
    }
}