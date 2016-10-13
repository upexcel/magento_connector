import { Component, OnInit} from '@angular/core';
import { ModalController, NavController, Storage, LocalStorage, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { tourPage } from '../takeTour/tour';
import { PopoverController, Platform, LoadingController } from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {FbProvider } from './../../providers/fb-service/fb-service';
import {GooglePlus, Facebook, SpinnerDialog} from 'ionic-native'
import {HomePage} from './../home/home';
@Component({
    templateUrl: 'build/pages/startpage/startpage.html',
    providers: [FormService, FbProvider]
})

export class StartPage implements OnInit {

    fb_firstname: any;
    fb_lastname: any;
    fb_email: any;
    fb_profilepic: any;
    google_firstname: any;
    google_lastname: any;
    google_email: any;
    google_profilepic: any;
    google_accesstoken: any;
    google_idToken: any;
    local: any;
    messsage_expired: any;
    logo: any;
    logo_alt: any;
    website_id: any;
    store_id: any;
    background_image: any;
    options: {};
    constructor(public loadingCtrl: LoadingController, public fbProvider: FbProvider,
        private navCtrl: NavController, private navparam: NavParams,
        public modalCtrl: ModalController, private _formService: FormService) {

        this.local = new Storage(LocalStorage);
        this.messsage_expired = this.navparam.get("message")
        this.options = {
            clientid: '1031859043774-igp8cfuhmbu0tfoc4fsoh7hsvhcesubc.apps.googleusercontent.com1031859043774-kqq13o4p0tu4etb7977ji042gf9sg071.apps.googleusercontent.com'
        }
    }
    ngOnInit() {
        this.getlogo();
    }

    gotologin() {
        this.navCtrl.push(LoginPage);
    }
    presentProfileModal() {
        let profileModal = this.modalCtrl.create(tourPage);
        profileModal.present();
    }
    getlogo() {
        var body = {};
        this._formService.api("web/config", body).subscribe((res) => {
            this.logo = JSON.parse(res.body).data.logo_url;
            this.background_image = JSON.parse(res.body).data.background_image;
            this.logo_alt = JSON.parse(res.body).data.logo_alt;
            this.website_id = JSON.parse(res.body).data.website_id;
            this.store_id = JSON.parse(res.body).data.store_id;
            this.local.set("website_id", this.website_id);
            this.local.set("store_id", this.store_id);
        })
    }
    onFacebookLoginClick() {
        this.fbProvider.login().then((res) => {
            this.fbProvider.getCurrentUserProfile().then(
                (profileData) => {
                    this.fb_firstname = profileData.first_name;
                    this.fb_lastname = profileData.last_name;
                    this.fb_email = profileData.email;
                    this.fb_profilepic = profileData.picture.data.url;
                    var body = { firstname: this.fb_firstname, lastname: this.fb_lastname, email: this.fb_email, picture: this.fb_profilepic };
                    this._formService.social_auth("customer/social_account", body).subscribe((res) => {
                        console.log(res);
                    })
                }
            );
        });
    }
    google_login() {
        this.presentLoading();
        this.fbProvider.google_login(this.options).then((res) => {
            console.log(res);
            this.google_firstname = res.givenName;
            this.google_lastname = res.familyName;
            this.google_email = res.email;
            this.google_profilepic = res.imageUrl;
            this.google_accesstoken = res.accessToken;
            var body = { firstname: this.google_firstname, lastname: this.google_lastname, email: this.google_email, picture: this.google_profilepic };
            this.local.set("firstname", this.google_firstname);
            this.local.set("lastname", this.google_lastname);
            this.local.set("email", this.google_email);
            this.local.set("access_token", this.google_accesstoken);
            this.navCtrl.setRoot(HomePage);
        })
    }
    presentLoading() {
        let loader = this.loadingCtrl.create({
            content: "Loading...",
            duration: 3000
        });
        loader.present();
    }
}