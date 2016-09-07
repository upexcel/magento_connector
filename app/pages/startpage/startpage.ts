import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LoginPage} from '../login/login';

@Component({
    templateUrl: 'build/pages/startpage/startpage.html'
})
export class StartPage {
    innerHeight: number;
    height: string;
    constructor(private navCtrl: NavController) {
        this.innerHeight = window.innerHeight;
        console.log(this.innerHeight);
    }
    gotologin(){
        this.navCtrl.push(LoginPage);
    }
}