import { Pipe, PipeTransform } from '@angular/core';
import reverse from 'lodash/reverse';
@Pipe({ name: 'reverceAddressCart' })
export class ReverceAddressCart implements PipeTransform {
    transform(obj: any, attr: any): any {
    let rev=reverse(obj);
        return rev;
    }
}

