import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GenericAnalytics } from './../../providers/genericAnalytics/genericAnalytics';
@Component({
    selector: 'page-offline',
    templateUrl: 'offline.html'
})
export class OfflinePage {

    constructor(public _genericAnalytic: GenericAnalytics, public navCtrl: NavController) { }
    ionViewWillEnter() {
        this._genericAnalytic.setTrackView("offline Page");
    }
}
