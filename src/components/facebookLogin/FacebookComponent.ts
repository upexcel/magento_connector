import { NavController, AlertController} from 'ionic-angular';
import { Component, Output, EventEmitter } from '@angular/core';
import {SocialService} from '../../providers/social-service/social-service';
import {FacebookData} from './facebookData';
@Component({
    selector: 'facebook-login',
    template: `  <button ion-button color='primary' (click)="getFacebookData()" id="social"> 
                 <ion-icon name="logo-facebook"></ion-icon>Login with Facebook
                 </button>`
})
export class FacebookComponent {
    fb_data: FacebookData = {
        fb_firstname: '',
        fb_lastname: '',
        fb_email: '',
        fb_profilepic: '',
        fb_accessToken: ''
    };
    @Output() userfbLogin: EventEmitter<any> = new EventEmitter();
    constructor(private _socialProvider: SocialService, private _alertCtrl: AlertController) { }
    getFacebookData() {
        var self = this;
        this._socialProvider.fbLogin().then((res) => {
            this._socialProvider.getFbCurrentUserProfile().then(
                (profileData) => {
                    this.fb_data.fb_firstname = profileData.first_name;
                    this.fb_data.fb_lastname = profileData.last_name;
                    this.fb_data.fb_email = profileData.email;
                    this.fb_data.fb_profilepic = profileData.picture.data.url;
                    let body = { firstname: this.fb_data.fb_firstname, lastname: this.fb_data.fb_lastname, email: this.fb_data.fb_email, picture: this.fb_data.fb_profilepic };
                    self.userfbLogin.emit(body);
                })
        })
            .catch((err) => {
                this.showFbAlert(err);
            });
    }
    showFbAlert(error) {
        let alert = this._alertCtrl.create({
            title: 'Error',
            subTitle: error,
            buttons: ['OK']
        });
        alert.present();
    }
}

