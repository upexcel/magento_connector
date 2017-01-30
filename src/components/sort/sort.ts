import { Component, Input, Output, OnInit } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { ModalController, Platform, NavParams } from 'ionic-angular';

@Component({
    selector: 'sort',
    templateUrl: 'sort.html'
})
export class SortBy {
    @Input() product: any;
    constructor( private _navCtrl: NavController, private _viewCtrl: ViewController, private _modalCtrl: ModalController) {
    }
    ngOnInit() {
    }

    dismiss() {
        this._viewCtrl.dismiss();
    }

}