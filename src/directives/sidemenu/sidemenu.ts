import {Component,OnInit} from '@angular/core';
import { CategoryListDataType } from './../../pages/home/categorylistDataType';
import { CategoryList } from '../../model/home/categoryList';
import { MenuController,NavController} from 'ionic-angular';
import { CategoryProductPage } from '../../pages/categoryProduct/categoryProduct';
@Component({
  selector:'sidemenu',
  templateUrl:'sidemenu.html'
})
export class SideMenu implements OnInit{
  data:CategoryListDataType;
constructor(private _categoryList:CategoryList,private _menuCtrl: MenuController,private _navCtrl:NavController){}
ngOnInit(){
  this._menuCtrl.enable(true);
  this.categoryList();
}
categoryList(){
  this._categoryList.getCategoryList().then((res) => {
      if (res) {
          this.data = res;
      }
  });
}

gotoCategoryProduct(gchild_id: any, gchild_name: any) {
    this._menuCtrl.close();
    this._navCtrl.push(CategoryProductPage, { "id": gchild_id, "name": gchild_name });
}
toggle(_toggleData) {
    if (_toggleData.showDetails) {
        _toggleData.showDetails = false;
        _toggleData.icon = 'ios-add-circle-outline';
    } else {
        _toggleData.showDetails = true;
        _toggleData.icon = 'ios-remove-circle-outline';
    }
}
}
