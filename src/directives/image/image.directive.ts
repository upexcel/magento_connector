import { Directive, ElementRef, Input, Renderer, HostListener } from '@angular/core';
@Directive({
			 selector: '[imgageDirective]',
			 host: { '(load)': 'handleLoad()' }
		  })
export class ImageDirective {
    constructor(private _el: ElementRef, private renderer: Renderer) {
    	setTimeout(()=>{
    		console.log(this._el)
	       console.log(this._el.nativeElement.src)
	       this.renderer.setElementStyle(this._el.nativeElement, 'display', 'none');
	       // el.nativeElement.src = "http://pop.h-cdn.co/assets/cm/15/06/54cfd569f384a_-_bta-products-01-1013-de.jpg";
    	})
    }
    handleLoad(){
    	console.log('load')
    	// setTimeout(()=>{
    		this.renderer.setElementStyle(this._el.nativeElement, 'display', 'block');
    		this.renderer.setElementStyle(this._el.nativeElement.nextElementSibling, 'display', 'none');
    	// },5000)
    }
}