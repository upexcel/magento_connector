import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
import reverse from 'lodash/reverse';

@Injectable()
export class Address {
    address: any;
    constructor() { }
    resetAddress() {
        this.address;
    }
    setAddress(data) {
        if (data) {
            this.address=(data);
            console.log("this.address",this.address)
        }
    }
    getAddress() {
        return new Promise((resolve, reject) => {
            resolve(this.address)
        })
    }
}


