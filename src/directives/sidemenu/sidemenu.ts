import {Component, OnInit, Input} from '@angular/core';
import {CategoryListDataType} from './../../pages/home/categorylistDataType';
import {CategoryList} from '../../model/home/categoryList';
import {MenuController, NavController} from 'ionic-angular';
import {CategoryProductPage} from '../../pages/categoryProduct/categoryProduct';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import forEach from 'lodash/forEach';
@Component({
    selector: 'sidemenu',
    templateUrl: 'sidemenu.html'
})
export class SideMenu implements OnInit {
    @Input() token: any;
    data: CategoryListDataType;
    public rootPage: any;
    public access_token;
    public usermenu: boolean;
    constructor(private _appConfigService: AppDataConfigService, private _categoryList: CategoryList, private _menuCtrl: MenuController, private _navCtrl: NavController) {}
    ngOnInit() {
        this._menuCtrl.enable(true);
        this.categoryList();
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData != null) {
                this.usermenu = true;
            } else {
                this.usermenu = false;
            }
        });

    }
    categoryList() {
        this._categoryList.getCategoryList().then((res) => {
            if (res) {
                forEach(res['body'].children, (value) => {
                    forEach(value['children'], (children) => {
                        children['showDetails'] = false;
                    })
                })
                this.data = res;
            }
        });
    }

    gotoCategoryProduct(gchild_id: any, gchild_name: any) {
        setTimeout(() => {
            forEach(this.data['body'].children, (value) => {
                forEach(value['children'], (children) => {
                    children['showDetails'] = false;
                    children['icon'] = 'ios-add-circle-outline';
                })
            })
        }, 100);
        this._menuCtrl.close();
        this._navCtrl.push(CategoryProductPage, {"id": gchild_id, "name": gchild_name});
    }
    toggle(_toggleData) {
        if (_toggleData.children.length > 0) {
            if (_toggleData.showDetails) {
                _toggleData.showDetails = false;
                _toggleData.icon = 'ios-add-circle-outline';
            } else {
                _toggleData.showDetails = true;
                _toggleData.icon = 'ios-remove-circle-outline';
            }
        }
        else {
            this._menuCtrl.close();
            this._navCtrl.push(CategoryProductPage, {"id": _toggleData.id, "name": _toggleData.name});
        }

    }

}
