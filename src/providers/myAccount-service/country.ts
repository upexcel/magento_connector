import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Country } from '../../model/myaccount/country';
declare let Promise: any;
@Injectable()
export class CountryService implements OnInit {
    constructor(public local: Storage, private _countryName: Country) { }
    ngOnInit() { }

    getCountryName() {
        let local = this.local;
        return new Promise((resolve, reject) => {
            local.get('countryName').then((countryName: string) => {
                if (countryName != null && countryName != undefined) {
                    resolve(countryName);
                }
                else {
                    this._countryName.getCountryName().then((res) => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        });
    }
}
