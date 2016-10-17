import { Component, OnInit} from '@angular/core';
import { ModalController, NavController, LoadingController, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { TourPage } from '../takeTour/tour';
import {HomePage} from '../home/home';
import { Storage } from '@ionic/storage';
import {ApiService } from './../../providers/api-service/api-service';
import {SocialService} from '../../providers/social-service/social-service'
@Component({
    templateUrl: 'startpage.html'
})
export class StartPage implements OnInit {
    fb_firstname: string;
    fb_lastname: string;
    fb_email: string;
    fb_profilepic: string;
    google_firstname: string;
    google_lastname: string;
    google_email: string;
    google_profilepic: string;
    google_accesstoken: string;
    google_idToken: string;
    messsage_expired: string;
    logo: string;
    logo_alt: string;
    website_id: string;
    store_id: string;
    background_image: string;
    check: boolean = false;
    options: {};
    //    local: any;
    constructor(private _local: Storage, private _loadingCtrl: LoadingController, private _socialProvider: SocialService,
        private _navCtrl: NavController, private _navparam: NavParams,
        public _modalCtrl: ModalController, private _apiService: ApiService) { }
    ngOnInit() {
        this.getlogo();
        this.messsage_expired = this._navparam.get("message")
        this.options = {
            clientid: '1031859043774-igp8cfuhmbu0tfoc4fsoh7hsvhcesubc.apps.googleusercontent.com1031859043774-kqq13o4p0tu4etb7977ji042gf9sg071.apps.googleusercontent.com'
        }
    }

    gotologin() {
        this._navCtrl.push(LoginPage);
    }

    presentProfileModal() {
        let profileModal = this._modalCtrl.create(TourPage);
        profileModal.present();
    }
    getlogo() {
        let body = {};
        this._apiService.api("web/config", body).subscribe((res) => {
            let parse = JSON.parse(res.body);
            this.logo = parse.data.logo_url;
            this.background_image = parse.data.background_image;
            this.logo_alt = parse.data.logo_alt;
            this.website_id = parse.data.website_id;
            this.store_id = parse.data.store_id;
            this._local.set('website_id', this.website_id);
            this._local.set('store_id', this.store_id);
            this.check = true;
        });
    }
    onFacebookLoginClick() {
        this._socialProvider.login().then((res) => {
            this._socialProvider.getCurrentUserProfile().then(
                (profileData) => {
                    this.fb_firstname = profileData.first_name;
                    this.fb_lastname = profileData.last_name;
                    this.fb_email = profileData.email;
                    this.fb_profilepic = profileData.picture.data.url;
                    let body = { firstname: this.fb_firstname, lastname: this.fb_lastname, email: this.fb_email, picture: this.fb_profilepic };
                    this._local.set("firstname", this.fb_firstname);
                    this._local.set("lastname", this.fb_lastname);
                    this._local.set("email", this.fb_email);
                    this._local.set("access_token", this.fb_profilepic);
                    this._navCtrl.setRoot(HomePage);
                }
            );
        });
    }
    google_login() {
        this.presentLoading();
        this._socialProvider.google_login(this.options).then((res) => {
            this.google_firstname = res.givenName;
            this.google_lastname = res.familyName;
            this.google_email = res.email;
            this.google_profilepic = res.imageUrl;
            this.google_accesstoken = res.accessToken;
            let body = { firstname: this.google_firstname, lastname: this.google_lastname, email: this.google_email, picture: this.google_profilepic };
            this._local.set("firstname", this.google_firstname);
            this._local.set("lastname", this.google_lastname);
            this._local.set("email", this.google_email);
            this._local.set("access_token", this.google_accesstoken);
            this._navCtrl.setRoot(HomePage);
        })
    }
    presentLoading() {
        let loader = this._loadingCtrl.create({
            content: "Loading...",
            duration: 3000
        });
        loader.present();
    }
}