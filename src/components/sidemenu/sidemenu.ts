import {Component, OnInit, Input} from '@angular/core';
import {CategoryListDataType} from '../../model/home/categorylistDataType';
import {CategoryList} from '../../model/home/categoryList';
import {MenuController} from 'ionic-angular';

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
    constructor(private _categoryList: CategoryList, private _menuCtrl: MenuController) {}
    ngOnInit() {
        this._menuCtrl.enable(true);
        this.categoryList();
    }

    /*
  *categoryList
  *calling service for get category list
  */
    categoryList() {
        this._categoryList.getCategoryList().then((res) => {
            if (res) {
                this.data = res;
            }
        });
    }


}