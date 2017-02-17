
import { Component, Output, EventEmitter } from '@angular/core';
import { SocialService } from '../../providers/social-service/social-service';
import { GoogleData } from './googleData';
import { Storage } from '@ionic/storage';
@Component({
    selector: 'google-login',
    template: `  <button ion-button color='danger' (click)="getGoogleData()" id="social">  
    <ion-icon  name="logo-google" > </ion-icon> Login with Google   <ion-spinner *ngIf="spin" class="spin">
            </ion-spinner>          
    </button>`
})
export class GoogleComponent {
    google_data: GoogleData;
    spin = false;
    @Output() usergoogleLogin: EventEmitter<any> = new EventEmitter();
    @Output() usergoogleError: EventEmitter<any> = new EventEmitter();
    constructor(public _local: Storage, private _socialProvider: SocialService) { }
    getGoogleData() {
        this.spin = true;
        console.log("collres1")
        this._socialProvider.googleLogin().then((res) => {
            console.log("googleApi Coll")
            this.spin = false;
            this.google_data = res;
            console.log("collres", res)
            this._local.get('website_id').then((website_id: string) => {
                let body = { website_id: website_id, firstname: this.google_data.givenName, lastname: this.google_data.familyName, email: this.google_data.email, picture: this.google_data.imageUrl, social: "google", social_id: this.google_data.userId, token: { accessToken: this.google_data.serverAuthCode } };
                this.usergoogleLogin.emit(body);
            });
        })
            .catch((err) => {
                console.log("ree",err)
                this.spin = false;
                this.usergoogleError.emit(err);
            })
    }
}

