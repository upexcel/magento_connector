import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

@Component({
    selector: 'wishList',
    templateUrl: 'wishList.html'
})
export class wishList {
    data:any;
    constructor(private _navParams: NavParams,public _nav: NavController) {
this.data = this._navParams.get('data');
}}
