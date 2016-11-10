import { Pipe, PipeTransform } from '@angular/core';
import sortBy from 'lodash/sortBy';
@Pipe({ name: 'sortList' })
export class SortBydate implements PipeTransform {
    transform(obj: any, attr: any): any {

//        let listData = sortBy(obj, [function(o) { return o.created_at-1 }]);
        return obj;
    }
}