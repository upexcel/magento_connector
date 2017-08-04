import {Injectable} from '@angular/core';
import pull from 'lodash/pull';

@Injectable()
export class SideMenuService {
    sildeMenuDataToBeClose = [];
    constructor() {}
    resetMenuData() {
        this.sildeMenuDataToBeClose = [];
    }
    getMenuData() {
        return this.sildeMenuDataToBeClose;
    }
    setMenuData(data, action) {
        if (action) {
            this.sildeMenuDataToBeClose.push(data);
        } else {
            pull(this.sildeMenuDataToBeClose,data);
        }
    }
}
