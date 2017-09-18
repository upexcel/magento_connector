import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoaderProvider {
    loader: any;
    constructor(public http: Http) {
    }
    setLoderReference(data) {
        this.loader = data;
    }
    getLoderReference() {
        return this.loader;
    }
    clearReference() {
        this.loader = null;
    }
}
