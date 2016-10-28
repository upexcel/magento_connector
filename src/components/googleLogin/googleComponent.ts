import { NavController} from 'ionic-angular';
import { Component, Output, EventEmitter } from '@angular/core';
import {SocialService} from '../../providers/social-service/social-service';
import {GoogleData} from './googleData';
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
    constructor(private _socialProvider: SocialService) { }
    getGoogleData() {
        var self = this;
        this._socialProvider.googleLogin().then((res) => {
            this.google_data=res;
            let body = { firstname: this.google_data.givenName, lastname: this.google_data.familyName, email: this.google_data.email, picture: this.google_data.imageUrl , accessToken: this.google_data.accessToken};
            self.usergoogleLogin.emit(body);
        })
            .catch((err) => {
                self.usergoogleError.emit(err);
            })
    }
}

