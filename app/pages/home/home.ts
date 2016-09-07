import { Component, OnInit } from '@angular/core';
import { NavController, MenuController} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
@Component({
    templateUrl: 'build/pages/home/home.html',
    providers: [FormService]
})
export class HomePage implements OnInit {
    lists:any;
    constructor(private navCtrl: NavController, private menuCtrl: MenuController,private _formService: FormService) {

    }
    ngOnInit() {
        var path = { "parent_id": "1", "type": "full" }
        this._formService.api("category/categorylist/", path).subscribe((res) => {
            if (res) {
                console.log(res);
                this.lists = res.children;
               // localStorage.setItem('lists', JSON.stringify(this.lists))
              //  console.log(this.lists);
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

}
