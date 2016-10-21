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
    google_data: GoogleData = {
        google_firstname: '',
        google_lastname: '',
        google_email: '',
        google_profilepic: '',
        google_accesstoken: ''
    }
    @Output() usergoogleLogin: EventEmitter<any> = new EventEmitter();
    @Output() usergoogleError: EventEmitter<any> = new EventEmitter();
    constructor(private _socialProvider: SocialService) { }
    getGoogleData() {
        var self = this;
        this._socialProvider.googleLogin().then((res) => {
            this.google_data.google_firstname = res.givenName;
            this.google_data.google_lastname = res.familyName;
            this.google_data.google_email = res.email;
            this.google_data.google_profilepic = res.imageUrl;
            this.google_data.google_accesstoken = res.accessToken;
            let body = { firstname: this.google_data.google_firstname, lastname: this.google_data.google_lastname, email: this.google_data.google_email, picture: this.google_data.google_profilepic };
            self.usergoogleLogin.emit(body);
        })
            .catch((err) => {
                self.usergoogleError.emit(err);
            })
    }

}

