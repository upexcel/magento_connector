import { Component, OnInit} from '@angular/core';
import { ModalController, NavController, LoadingController, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { TourPage } from '../takeTour/tour';
import {HomePage} from '../home/home';
import { Storage } from '@ionic/storage';
import {FormService } from './../../providers/form-service/form-service';
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
    constructor(public local: Storage, public loadingCtrl: LoadingController, public socialProvider: SocialService,
        private navCtrl: NavController, private navparam: NavParams,
        public modalCtrl: ModalController, private _formService: FormService) {
        this.local = local;
        console.clear();
    }
    ngOnInit() {
        this.getlogo();
        this.messsage_expired = this.navparam.get("message")
        this.options = {
            clientid: '1031859043774-igp8cfuhmbu0tfoc4fsoh7hsvhcesubc.apps.googleusercontent.com1031859043774-kqq13o4p0tu4etb7977ji042gf9sg071.apps.googleusercontent.com'
        }
    }

    gotologin() {
        this.navCtrl.push(LoginPage);
    }

    presentProfileModal() {
        let profileModal = this.modalCtrl.create(TourPage);
        profileModal.present();
    }
    getlogo() {
        let body = {};
        this._formService.api("web/config", body).subscribe((res) => {
            let parse = JSON.parse(res.body);
            this.logo = parse.data.logo_url;
            this.background_image = parse.data.background_image;
            this.logo_alt = parse.data.logo_alt;
            this.website_id = parse.data.website_id;
            this.store_id = parse.data.store_id;
            this.local.set('website_id', this.website_id);
            this.local.set('store_id', this.store_id);
            this.check = true;
        });
    }
    onFacebookLoginClick() {
        this.socialProvider.login().then((res) => {
            this.socialProvider.getCurrentUserProfile().then(
                (profileData) => {
                    this.fb_firstname = profileData.first_name;
                    this.fb_lastname = profileData.last_name;
                    this.fb_email = profileData.email;
                    this.fb_profilepic = profileData.picture.data.url;
                    let body = { firstname: this.fb_firstname, lastname: this.fb_lastname, email: this.fb_email, picture: this.fb_profilepic };
                    this.local.set("firstname", this.fb_firstname);
                    this.local.set("lastname", this.fb_lastname);
                    this.local.set("email", this.fb_email);
                    this.local.set("access_token", this.fb_profilepic);
                    this.navCtrl.setRoot(HomePage);
                }
            );
        });
    }
    google_login() {
        this.presentLoading();
        this.socialProvider.google_login(this.options).then((res) => {
            console.log(res);
            this.google_firstname = res.givenName;
            this.google_lastname = res.familyName;
            this.google_email = res.email;
            this.google_profilepic = res.imageUrl;
            this.google_accesstoken = res.accessToken;
            let body = { firstname: this.google_firstname, lastname: this.google_lastname, email: this.google_email, picture: this.google_profilepic };
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