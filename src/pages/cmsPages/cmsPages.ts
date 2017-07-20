import {Component} from '@angular/core';
import {CMS} from './../../model/cms/cms';
import { NavParams } from 'ionic-angular';

@Component({
selector: 'cms-pages',
templateUrl: 'cmsPages.html'
})
export class cmsPages {
theHtmlString: string;
spinner: boolean = true;
title: string;
constructor(public _cms: CMS, public _navParam: NavParams) {
this.title = this._navParam.data.pageDetails.title; //get title name
this._cms.getStaticPageData({"page_code": this._navParam.data.pageDetails.identifier}).then((res) => { //call "web/getStaticPageContent api
this.theHtmlString = res.body;
this.spinner = false;
})
}
}
