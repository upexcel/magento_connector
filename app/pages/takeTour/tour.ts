import { Component} from '@angular/core';
import { Slides } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
@Component({
    templateUrl: 'build/pages/takeTour/tour.html'
})
export class tourPage {
    mySlideOptions = {
        initialSlide: 1,
        loop: true,
        pager:true
    };
    constructor(private viewCtrl: ViewController) {}
    close(){
        
         this.viewCtrl.dismiss();
    }
}

