import { Component, OnInit } from '@angular/core';
import { NavController, Storage, LocalStorage, MenuController, PopoverController} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover';
@Component({
    templateUrl: 'build/pages/home1/home1.html',
    providers: [FormService],
    directives: []
})
export class HomePage1 implements OnInit {
    lists: any;
    public data: Data[];
    local: any;
    showList: boolean = false;
    clickshow:boolean=false;
    products:any;
    constructor(private navCtrl: NavController, private menuCtrl: MenuController, private popoverCtrl: PopoverController, private _formService: FormService) {
        this.local = new Storage(LocalStorage);
    }
    ngOnInit() {

    }
    mySlideOptions = {
        autoplay: 3000,
        initialSlide: 1,
        loop: true,
        pager: true
    };
    openMenu() {
        console.log("nav");
        this.menuCtrl.open();
    }
    presentPopover(myEvent: any) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
}
