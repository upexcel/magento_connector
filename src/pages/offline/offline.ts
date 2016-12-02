import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-offline',
  templateUrl: 'offline.html'
})
export class OfflinePage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello OfflinePage Page');
  }

}
