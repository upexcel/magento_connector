import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
import findIndex from 'lodash/findIndex';
@Injectable()
export class FilterService {
    filterData: any = [];
    count: number = 0;
    index: number;
    constructor() { }
    setFilterData(data) {
        if (this.filterData && this.filterData.length > 0) {
            this.count = 0;
            forEach(this.filterData, (value, key: any) => {
                if (value.title == data.title) {
                    this.index = (key * 1);
                    this.count = 0;
                    return false;
                } else {
                    this.count = 1;
                }
            });
            if (this.count == 1) {
                this.filterData.push(data);
            } else {
                this.filterData.splice(this.index, 1);
                this.index;
                this.filterData.push(data);
            }
        } else {
            this.filterData = [data];
        }
        console.log(this.filterData)
    }
    getFilterData() {
        return new Promise((resolve, reject) => {
            resolve(this.filterData)
        })
    }
}
