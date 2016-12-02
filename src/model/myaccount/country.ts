import { Injectable, OnInit}    from '@angular/core';
import { Storage } from '@ionic/storage';
import { CountryService } from './../../providers/myAccount-service/country';
declare let Promise: any;
@Injectable()
export class Country implements OnInit {
    constructor(public local: Storage, private _countryName: CountryService) { }
    ngOnInit() { }

    getCountryName(data) {
        let local = this.local;
        return new Promise((resolve, reject)=> {
            local.get('countryName').then((countryName: string) => {
                if (countryName != null && countryName != undefined){
                    resolve(countryName);
                }
                else {
                    this._countryName.getCountryName(data).then((res)=> {
                        resolve(res);
                    }, (err)=>{
                        reject(err);
                    });
                }
            });
        });
    }
}
