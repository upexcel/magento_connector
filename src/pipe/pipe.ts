import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';
import { Storage } from '@ionic/storage';
@Pipe({ name: 'filter' })
export class Filter implements PipeTransform {
    constructor(public local: Storage) { }
    transform(obj: any, attr: any): any {
        let lists;
        let data: any = [];
        let filterData: any = [];
        this.local.get('search').then((value: any) => {
                        console.log(value);
            for (let i = 0; i < obj.length; i++) {
                _.forEach(attr, function(value, key) {
                    if (key == obj[i]) {
                        data.push(value);
                    }
                });
            }
            let uniqdata=_.uniqWith(value, _.isEqual);
            for (let i = 0; i < data.length; i++) {
                _.forEach(uniqdata, function(value1, key) {
                    _.forEach(value1, function(value2, key) {
                        _.forEach(value2.options, function(value3, key) {
                            if (value3.id == data[i]) {
                                filterData.push(value3.label);
                            }
                        });
                    });
                });
            }
        });
        return filterData;
    }
}