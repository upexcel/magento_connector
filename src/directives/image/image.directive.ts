import { Directive, ElementRef,  Renderer } from '@angular/core';
@Directive({
			 selector: '[imageDirective]',
			 host: { '(load)': 'handleLoad()' }
		  })
export class ImageDirective {
    constructor(private _el: ElementRef, private renderer: Renderer) {
    	setTimeout(()=>{
	       this.renderer.setElementStyle(this._el.nativeElement, 'display', 'none');
    	})
    }
    handleLoad(){
    	setTimeout(()=>{
    		this.renderer.setElementStyle(this._el.nativeElement, 'display', 'block');
    		this._el.nativeElement.nextElementSibling.outerHTML = '';
    	},10)
    }
}