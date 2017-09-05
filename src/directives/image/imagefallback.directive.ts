import { Directive, ElementRef } from '@angular/core';
import {config} from './../../providers/config/config';
@Directive({
			 selector: 'img',
			 host: { '(error)': 'fixImageUrl()' }
		  })
export class ImageFallBackDirective {
    constructor(private _el: ElementRef) {
    }
    fixImageUrl(){
        this._el.nativeElement.src = config.defaultImage;
    }
}