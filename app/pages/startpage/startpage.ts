import { Component, OnInit} from '@angular/core';
import { ModalController, NavController, Storage, LocalStorage, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { tourPage } from '../takeTour/tour';
import { PopoverController } from 'ionic-angular';
import {HomePage} from '../home/home'
@Component({
    templateUrl: 'build/pages/startpage/startpage.html'
})

export class StartPage implements OnInit {

    firstname: any;
    lastname: any;
    access_token: any;
    expiry: any;
    local: any;
    messsage_expired: any;
    constructor(private navCtrl: NavController, private navparam: NavParams, private popoverCtrl: PopoverController, public modalCtrl: ModalController) {
        this.local = new Storage(LocalStorage);
        this.messsage_expired = this.navparam.get("message")
        // console.clear();
    }
    ngOnInit() {
    }

    gotologin() {
        this.navCtrl.push(LoginPage);
    }
    presentProfileModal() {
        let profileModal = this.modalCtrl.create(tourPage);
        profileModal.present();
    }

}