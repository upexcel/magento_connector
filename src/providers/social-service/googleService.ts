import { NavController} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {SocialService} from '../social-service/social-service'
import {GoogleLogin} from '../../components/googleLogin/googleLoginComponent'
import { Storage } from '@ionic/storage';
import {HomePage} from '../../pages/home/home';
@Injectable()
export class GoogleService {
    google_data: GoogleLogin = {
        google_firstname: '',
        google_lastname: '',
        google_email: '',
        google_profilepic: '',
        google_accesstoken: ''
    }
    constructor(private _socialProvider: SocialService, private _local: Storage, private _navCtrl: NavController) {
    }
    getGoogleData(options) {
        this._socialProvider.google_login(options).then((res) => {
            console.log(res);
            this.google_data.google_firstname = res.givenName;
            this.google_data.google_lastname = res.familyName;
            this.google_data.google_email = res.email;
            this.google_data.google_profilepic = res.imageUrl;
            this.google_data.google_accesstoken = res.accessToken;
            let body = { firstname: this.google_data.google_firstname, lastname: this.google_data.google_lastname, email: this.google_data.google_email, picture: this.google_data.google_profilepic };
            this._local.set("googleData", body);
            this._navCtrl.setRoot(HomePage);
        })
    }

}

