
import { Component, Output, EventEmitter } from '@angular/core';
import { SocialService } from '../../providers/social-service/social-service';
import { GoogleData } from './googleData';
import { Storage } from '@ionic/storage';
import { ToastService } from './../../providers/toast-service/toastService';

@Component({
    selector: 'google-login',
    template: `  <button ion-button color='danger' class="socialButton" (click)="getGoogleData()" id="social">  
    <ion-icon  name="logo-google" > </ion-icon> Login with Google  <ion-spinner *ngIf="spin" class="spin">
            </ion-spinner>          
    </button>`
})
export class GoogleComponent {
    google_data: GoogleData;
    spin = false;
    @Output() usergoogleLogin: EventEmitter<any> = new EventEmitter();
    @Output() usergoogleError: EventEmitter<any> = new EventEmitter();
    constructor(private _toast: ToastService, public _local: Storage, private _socialProvider: SocialService) { }
    getGoogleData() {
        if (this.spin == false) {
            this.spin = true;
            let error;
            this._socialProvider.googleLogin().then((res) => {
                this.spin = false;
                this.google_data = res;
                this._local.get('website_id').then((website_id: string) => {
                    setTimeout(() => {
                        this._toast.toast("Welcome " + this.google_data.givenName, 3000);
                    }, 3000)
                    let body = { website_id: website_id, firstname: this.google_data.givenName, lastname: this.google_data.familyName, email: this.google_data.email, picture: this.google_data.imageUrl, social: "google", social_id: this.google_data.userId, token: { accessToken: this.google_data.serverAuthCode } };
                    this.usergoogleLogin.emit(body);
                });
            }, (err) => {
                error = err;
                this.spin = false;
            })
            if (error) {
                this.usergoogleError.emit(error);
            }
        }
    }
}

