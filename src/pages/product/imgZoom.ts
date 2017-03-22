import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
@Component({
    selector: 'img-zoom',
    templateUrl: 'zoom.html'
})
export class ImgZoom {
    data: any;
    image:string;
    constructor(public _viewCtrl: ViewController, private _navParams: NavParams) {
        this.data = this._navParams.get('data');
        this.image=this.data[0];
    }
    slideClick(img: string) {
        this.image = img;
    }
    close() {
        this._viewCtrl.dismiss();
    }
}