import { Component, OnInit} from '@angular/core';
import { ModalController, NavController, Storage, LocalStorage} from 'ionic-angular';
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
    constructor(private navCtrl: NavController, private popoverCtrl: PopoverController, public modalCtrl: ModalController) {
        this.local = new Storage(LocalStorage);
        // console.clear();
    }
    ngOnInit() {
    }

    gotologin() {
        this.navCtrl.push(LoginPage);
    }
    //    presentPopover(myEvent) {
    //        var data = true;
    //        let popover = this.popoverCtrl.create(tourPage, {
    //            enableBackdropDismiss:true
    //        });
    //        popover.present({
    //            ev: myEvent
    //        });
    //    }
    presentProfileModal() {
        let profileModal = this.modalCtrl.create(tourPage);
        profileModal.present();
    }

}