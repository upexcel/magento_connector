import { NavController} from 'ionic-angular';
import { Component, Output, EventEmitter } from '@angular/core';
import {SocialService} from '../../providers/social-service/social-service';
import {GoogleData} from './googleData';
import { Storage } from '@ionic/storage';
@Component({
    selector: 'google-login',
    template: `  <button ion-button color='danger' (click)="getGoogleData()" id="social">  
    <ion-icon name="logo-google" > </ion-icon> Login with Google          
    </button>`
})
export class GoogleComponent {
    google_data: GoogleData;
    @Output() usergoogleLogin: EventEmitter<any> = new EventEmitter();
    @Output() usergoogleError: EventEmitter<any> = new EventEmitter();
    constructor(public _local: Storage, private _socialProvider: SocialService) { }
    getGoogleData() {
        var self = this;
        this._socialProvider.googleLogin().then((res) => {
            this.google_data = res;
            this._local.get('website_id').then((website_id: string) => {
                let body = { website_id: website_id,firstname: this.google_data.givenName, lastname: this.google_data.familyName, email: this.google_data.email, picture: this.google_data.imageUrl,social:"google", social_id: this.google_data.idToken, token: { accessToken: this.google_data.serverAuthCode } };
                self.usergoogleLogin.emit(body);
            });
        })
            .catch((err) => {
                self.usergoogleError.emit(err);
            })
    }
}

