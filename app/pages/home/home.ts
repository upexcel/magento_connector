import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, PopoverController} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {LoginPage} from './../login/login';
import { Data } from './../../components/data/data';
import {PopoverPage} from './../../components/popover/popover'
@Component({
    templateUrl: 'build/pages/home/home.html',
    providers: [FormService]
})
export class HomePage implements OnInit {
    lists: any;
    public data: Data[];
    constructor(private navCtrl: NavController, private menuCtrl: MenuController, private popoverCtrl: PopoverController, private _formService: FormService) {

    }
    ngOnInit() {
        var path = { "parent_id": "1", "type": "full" }
        this._formService.api("category/categorylist/", path).subscribe((res) => {
            if (res) {
                this.lists = res.data.children;
                localStorage.setItem('lists', JSON.stringify(this.lists));

            }
        },
            (err) => {

                if (err) {
                    console.log(err);
                }

            })
    }
    openMenu() {
        this.menuCtrl.open();
    }

    toggle(data: Data) {
        if (data.showDetails) {
            data.showDetails = false;
            data.icon = 'ios-add-circle-outline';
        } else {
            data.showDetails = true;
            data.icon = 'ios-remove-circle-outline';
        }
    }
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent
        });
    }

}
