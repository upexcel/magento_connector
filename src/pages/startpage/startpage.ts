import { Component, OnInit} from '@angular/core';
import { ModalController, NavController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import { tourPage } from '../takeTour/tour';
import { PopoverController } from 'ionic-angular';
import {HomePage} from '../home/home'
@Component({
    templateUrl: 'startpage.html'
})

export class StartPage implements OnInit {
    firstname: any;
    lastname: any;
    access_token: any;
    expiry: any;
    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public modalCtrl: ModalController) {
         console.clear();
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