
import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { SearchModel } from '../../model/search/search';

@Component({
  selector: 'page-search-item',
  templateUrl: 'search-item.html',
})
export class SearchItemPage implements OnInit {
	itemName="";
	searchProduct:any;
	spinner:boolean=true;
    constructor(private _search: SearchModel,private _navParams: NavParams) {
        this.itemName=this._navParams.get("data");
    }
    ngOnInit() {
	this.show_products();
    }
    ngOnDestroy() {
    }
    show_products() {
            let body = { "q": this.itemName};
            this._search.getSearchProduct(body).then((res) => {
            	this.spinner=false;
                this.searchProduct = res;
    },(err)=>{
                this.spinner=false;
            });
        }
 
}
