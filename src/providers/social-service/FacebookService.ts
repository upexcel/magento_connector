import { NavController} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {SocialService} from '../social-service/social-service'
import {FacebookLogin} from '../../components/facebookLogin/facebookLoginComponent'
import { Storage } from '@ionic/storage';
import {HomePage} from '../../pages/home/home';
@Injectable()
export class FacebookService {
    fb_data: FacebookLogin = {
        fb_firstname: '',
        fb_lastname: '',
        fb_email: '',
        fb_profilepic: '',
        fb_accessToken: ''
    };
    constructor(private _socialProvider: SocialService, private _local: Storage, private _navCtrl: NavController) {
    }
    getFacebookData() {
        this._socialProvider.login().then((res) => {
            this._socialProvider.getCurrentUserProfile().then(
                (profileData) => {
                    this.fb_data.fb_firstname = profileData.first_name;
                    this.fb_data.fb_lastname = profileData.last_name;
                    this.fb_data.fb_email = profileData.email;
                    this.fb_data.fb_profilepic = profileData.picture.data.url;
                    let body = { firstname: this.fb_data.fb_firstname, lastname: this.fb_data.fb_lastname, email: this.fb_data.fb_email, picture: this.fb_data.fb_profilepic };
                    this._local.set("fbProfileDate", body);
                    this._navCtrl.setRoot(HomePage);
                })
        })
    }

}

