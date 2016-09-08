import {Component} from '@angular/core';
import {ViewController, NavController} from 'ionic-angular'
import {LoginPage} from './../../pages/login/login'
@Component({
    template: `
    <ion-list>
      <button ion-item >My Account</button>
      <button ion-item (click)="logout()">Logout</button>
    </ion-list>
  `
})
export class PopoverPage {
    constructor(private viewCtrl: ViewController, private navCtrl: NavController) { }

    close() {
        this.viewCtrl.dismiss();
    }

    logout() {
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('expiry');
        localStorage.removeItem('access_token');
        localStorage.removeItem('lists');
        this.navCtrl.setRoot(LoginPage);
    }
}



