import { Component, OnInit} from '@angular/core';
import { ModalController, NavController, LoadingController, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { TourPage } from '../takeTour/tour';
import {HomePage} from '../home/home';
import { Storage } from '@ionic/storage';
import {ApiService } from './../../providers/api-service/api-service';
import {SocialService} from '../../providers/social-service/social-service';
import {FacebookService} from '../../providers/social-service/FacebookService';
import {GoogleService} from '../../providers/social-service/googleService';
@Component({
    templateUrl: 'startpage.html'
})
export class StartPage implements OnInit {
    messsage_expired: string;
    logo: string;
    logo_alt: string;
    website_id: string;
    store_id: string;
    background_image: string;
    check: boolean = false;
    options: {};
    constructor(private _local: Storage, private _loadingCtrl: LoadingController, private _socialProvider: SocialService, private _navCtrl: NavController, private _navparam: NavParams, private _modalCtrl: ModalController, private _apiService: ApiService, private _fbservice: FacebookService, private _googleservice: GoogleService) { }
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
        this._fbservice.getFacebookData().;
    }
    googleLogin() {
        this._googleservice.getGoogleData(this.options);
    }
    presentLoading() {
        let loader = this._loadingCtrl.create({
            content: "Loading...",
            duration: 3000
        });
        loader.present();
    }
}