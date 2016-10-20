import { Pipe, PipeTransform } from '@angular/core';
import forEach from 'lodash/forEach';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import { Storage } from '@ionic/storage';
@Pipe({ name: 'convert' })
export class Convert implements PipeTransform {
    constructor(public local: Storage) { }
    transform(obj: any, attr: any): any {
        let lists;
        let data: any = [];
        let filterData: any = [];
        this.local.get('search').then((value: any) => {
            for (let i = 0; i < obj.length; i++) {
                forEach(attr, function(value, key) {
                    if (key == obj[i]) {
                        data.push(value);
                    }
                });
            }
            let uniqdata = uniqWith(value, isEqual);
            for (let i = 0; i < data.length; i++) {
                forEach(uniqdata, function(value1, key) {
                    forEach(value1, function(value2, key) {
                        forEach(value2.options, function(value3, key) {
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