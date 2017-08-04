import {Component, OnInit, Input} from '@angular/core';
import forEach from 'lodash/forEach';
import {CategoryProductPage} from '../../pages/categoryProduct/categoryProduct';
import {NavController, MenuController} from 'ionic-angular';
import {FilterService} from './../../providers/filter-service/filterService';
import {SideMenuService} from './../../providers/sideMenu/sideMenu';

@Component({
    selector: 'side-menu-data',
    templateUrl: 'sideMenuData.html'
})
export class SideMenuChild implements OnInit {
    @Input() data: any;
    constructor(public _sideMenuService: SideMenuService, private _filterService: FilterService, private _menuCtrl: MenuController, private _navCtrl: NavController) {}
    ngOnInit() {
        this.createVertualData();
    }
    createVertualData() {
        forEach(this.data, (children) => {
            children['icon'] = 'ios-add-circle-outline';
            if (children.include_in_menu == "true") {
                if (children.children.length == 0) {
                    if (children.display_mode != "PAGE") {
                        children['show'] = true;
                    } else {
                        children['show'] = false;
                    }
                    children['hide'] = false;
                    children['toggle'] = false;
                } else {
                    children['show'] = true;
                    children['hide'] = true;
                    children['toggle'] = true;
                }
            } else {
                children['show'] = false;
            }
        })
    }
    manageData(value) {
        this._filterService.resetFilterData();
        let data = this._sideMenuService.getMenuData();
        if (data.length > 0) {
            forEach(data, (value) => {
                value.hide = true;
                value.icon = 'ios-add-circle-outline';
            })
        }
        this._sideMenuService.resetMenuData();

        this._menuCtrl.close();
        setTimeout(() => {
            this._navCtrl.push(CategoryProductPage, {"id": value.id, "name": value.name, "display_mode": value.display_mode});
        })

    }
    toggle(data) {
        if (data.hide) {
            data.icon = 'ios-remove-circle-outline';
            this._sideMenuService.setMenuData(data, 1);
            data.hide = false;
        } else {
            this._sideMenuService.setMenuData(data, 0);
            data.icon = 'ios-add-circle-outline';
            data.hide = true;
        }
    }
}