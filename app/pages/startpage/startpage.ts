import { Component, OnInit} from '@angular/core';
import { NavController, Storage, LocalStorage} from 'ionic-angular';
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
    constructor(private navCtrl: NavController , private popoverCtrl: PopoverController) {
        this.local = new Storage(LocalStorage);
        // console.clear();
    }
    ngOnInit() {
        this.checkCredentials();
    }

    gotologin() {
        this.navCtrl.push(LoginPage);
    }
    presentPopover(myEvent) {
        var data = true;
        let popover = this.popoverCtrl.create(tourPage, {
            enableBackdropDismiss:true
        });
        popover.present({
            ev: myEvent
        });
    }
    checkCredentials() {
        let name = this.local.get('firstname');
        let access_token;
        this.local.get('access_token').then((res) => {
            access_token = res;
            if (access_token != null) {
                this.navCtrl.setRoot(HomePage);
            } else {
                //            this.firstname = localStorage.getItem('firstname');
                //            this.lastname = localStorage.getItem('lastname');
                //            this.access_token = localStorage.getItem('access_token');
                //            this.expiry = localStorage.getItem('expiry')
                //            this.navCtrl.push(HomePage);
            }
        });

    }
}