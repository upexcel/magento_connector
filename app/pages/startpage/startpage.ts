import { Component, OnInit} from '@angular/core';
import { NavController, Storage, LocalStorage} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {HomePage} from '../home/home'
@Component({
    templateUrl: 'build/pages/startpage/startpage.html'
})
export class StartPage implements OnInit {
    innerHeight: number;
    height: string;
    firstname: any;
    lastname: any;
    access_token: any;
    expiry: any;
    local: any;
    constructor(private navCtrl: NavController) {
//        this.innerHeight = window.innerHeight;
//        console.log(this.innerHeight);
        this.local = new Storage(LocalStorage);
    }
    ngOnInit() {
        this.checkCredentials();
    }
    gotologin() {
        this.navCtrl.setRoot(LoginPage);
    }
    checkCredentials() {
        if (localStorage.getItem("firstname") != null && localStorage.getItem('access_token') != null) {
            this.navCtrl.push(HomePage);
        } else {
            //            this.firstname = localStorage.getItem('firstname');
            //            this.lastname = localStorage.getItem('lastname');
            //            this.access_token = localStorage.getItem('access_token');
            //            this.expiry = localStorage.getItem('expiry')
            //            this.navCtrl.push(HomePage);
        }
    }
}