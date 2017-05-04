import {Component, OnInit} from '@angular/core';
import {ViewController, NavParams, AlertController} from 'ionic-angular';

@Component({
    selector: 'search-page',
    templateUrl: 'search.html'
})
export class Search implements OnInit {
    // data: ConfigDataType;
    data: any;
    constructor(private _viewCtrl: ViewController) {
    }

    ngOnInit() {

        }
         dismiss() {
        this._viewCtrl.dismiss();
    }  
}
