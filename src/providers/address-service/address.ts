import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class Address {
    address: any;
    constructor() {}
    resetAddress() {
        this.address;
    }
    setAddress(data) {
        if (data) {
            this.address = (data);
        }
    }
    getAddress() {
        return new Promise((resolve, reject) => {
            resolve(this.address)
        })
    }
}


