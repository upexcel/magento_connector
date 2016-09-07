import { Component, OnInit } from '@angular/core';
import { NavController, MenuController} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {LoginPage} from './../login/login'
import { Data } from './../../components/data/data';
@Component({
    templateUrl: 'build/pages/home/home.html',
    providers: [FormService]
})
export class HomePage implements OnInit {
    lists: any;
    public data: Data[];
    constructor(private navCtrl: NavController, private menuCtrl: MenuController, private _formService: FormService) {
        
    }
    ngOnInit() {
        var path = { "parent_id": "1", "type": "full" }
        this._formService.api("category/categorylist/", path).subscribe((res) => {
            if (res) {
                this.lists = res.children;
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
    logout() {
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('expiry');
        localStorage.removeItem('access_token');
        this.navCtrl.push(LoginPage);
    }
   
}
