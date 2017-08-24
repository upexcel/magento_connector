
import {Component, Output, EventEmitter, Input} from '@angular/core';
import {SocialService} from '../../providers/social-service/social-service';
import {GoogleData} from './googleData';
import {Storage} from '@ionic/storage';
import {ToastService} from './../../providers/toast-service/toastService';
import {LoadingController} from 'ionic-angular';
import {LoaderProvider} from './../../providers/loader/loader'
@Component({
    selector: 'google-login',
    template: `  <button ion-button color='danger' class="socialButton" (tap)="getGoogleData()" id="social">  
    <ion-icon  name="logo-google" > </ion-icon> Login with Google  <ion-spinner *ngIf="spin" class="spin">
            </ion-spinner>          
    </button>`
})
export class GoogleComponent {
    google_data: GoogleData;
    spin = false;
    @Output() usergoogleLogin: EventEmitter<any> = new EventEmitter();
    @Output() usergoogleError: EventEmitter<any> = new EventEmitter();
    @Input() spinEvent: any;
    constructor(private _loading: LoaderProvider, public loadingCtrl: LoadingController, private _toast: ToastService, public _local: Storage, private _socialProvider: SocialService) {
        console.log("service call google")
            setTimeout(() => {
                console.log("this.spinEvent",this.spinEvent)
            if (this.spinEvent != 1) {
                this.spin = this.spinEvent;
                console.log("loderRef",this._loading.getLoderReference())
                this._loading.getLoderReference().dismiss();
                this._loading.clearReference();
            }
        }, 200)
    }
    /** 
*    getGoogleData
* function use  for get google login data
**/
    getGoogleData() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        setTimeout(() => {
            this._loading.setLoderReference(loading);
        },100)
        console.log(this.spin);
        if (this.spin == false) {
            loading.present();
            this.spin = true;
            let error;
            this._socialProvider.googleLogin().then((res) => {
                this.google_data = res;
                this._local.get('website_id').then((website_id: string) => {
                    let body = {website_id: website_id, firstname: this.google_data.givenName, lastname: this.google_data.familyName, email: this.google_data.email, picture: this.google_data.imageUrl, social: "google", social_id: this.google_data.userId, token: {accessToken: this.google_data.serverAuthCode}};
                    this.usergoogleLogin.emit(body);
                });
            }, (err) => {
                error = err;
                this._toast.toast(err, 3000);
                this.spin = false;
                loading.dismiss();
                this._loading.clearReference();
            })
            if (error) {
                this._toast.toast(error, 3000);
                this.usergoogleError.emit(error);
                this.spin = false;
                loading.dismiss();
                this._loading.clearReference();
            }
        }
    }
}

