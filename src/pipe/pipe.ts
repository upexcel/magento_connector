import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';
import { Storage } from '@ionic/storage';
@Pipe({ name: 'filter' })
export class filter implements PipeTransform {
    constructor(public local: Storage) {

    }
    transform(obj: any, attr: any): any {
        var lists;
        var data: any = [];
        var filterData: any = [];
        this.local.get('search').then((value: any) => {
            for (var i = 0; i < obj.length; i++) {
                _.forEach(attr, function(value, key) {
                    if (key == obj[i]) {
                        data.push(value);
                    }
                });
            }
            for (var i = 0; i < data.length; i++) {
                _.forEach(value, function(value1, key) {
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