import { Component, OnInit} from '@angular/core';
import { NavController, Storage, LocalStorage} from 'ionic-angular';
import {LoginPage} from '../login/login';
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
    constructor(private navCtrl: NavController) {
        this.local = new Storage(LocalStorage);
         console.clear();
    }
    ngOnInit() {
        this.checkCredentials();
    }
    gotologin() {
        this.navCtrl.push(LoginPage);
    }
    checkCredentials() {
        if (localStorage.getItem("firstname") != null && localStorage.getItem('access_token') != null) {
            this.navCtrl.push(HomePage);
        } else {
           
        }
    }
}