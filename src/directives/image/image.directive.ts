import { Directive, ElementRef, Input, Renderer, HostListener } from '@angular/core';
@Directive({
			 selector: '[imgageDirective]',
			 host: { '(load)': 'handleLoad()' }
		  })
export class ImageDirective {
    constructor(private _el: ElementRef, private renderer: Renderer) {
    	setTimeout(()=>{
	       this.renderer.setElementStyle(this._el.nativeElement, 'display', 'none');
    	})
    }
    handleLoad(){
    	console.log('load')
    	setTimeout(()=>{
    		this.renderer.setElementStyle(this._el.nativeElement, 'display', 'block');
    		this._el.nativeElement.nextElementSibling.outerHTML = '';
    	},10)
    }
}