import { NavController} from 'ionic-angular';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import {SocialService} from '../../providers/social-service/social-service'
import {GoogleData} from './googleData'
import { Storage } from '@ionic/storage';
import {HomePage} from '../../pages/home/home';
@Component({
    selector: 'google-login',
    template: `  <button ion-button color='danger' (click)="getGoogleData()" id="social">  
    <ion-icon name="logo-google" > </ion-icon> Login with Google          
    </button>`
})
export class GoogleComponent implements OnInit {
    google_data: GoogleData = {
        google_firstname: '',
        google_lastname: '',
        google_email: '',
        google_profilepic: '',
        google_accesstoken: ''
    }
    options: any = {};
    @Output() usergoogleLogin: EventEmitter<any> = new EventEmitter();
    constructor(private _socialProvider: SocialService, private _local: Storage, private _navCtrl: NavController) {
    }
    ngOnInit() {
        
    }
    getGoogleData() {
        var self = this;
        this.usergoogleLogin.emit(
            this._socialProvider.google_login().then((res) => {
                this.google_data.google_firstname = res.givenName;
                this.google_data.google_lastname = res.familyName;
                this.google_data.google_email = res.email;
                this.google_data.google_profilepic = res.imageUrl;
                this.google_data.google_accesstoken = res.accessToken;
                let body = { firstname: this.google_data.google_firstname, lastname: this.google_data.google_lastname, email: this.google_data.google_email, picture: this.google_data.google_profilepic };
                this._local.set("googleData", body);
                self._navCtrl.setRoot(HomePage);
            })
        );
    }

}

