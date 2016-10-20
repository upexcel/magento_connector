import {Directive, ElementRef, Input, Renderer } from '@angular/core';

@Directive({
	selector:'[nextEnter]',
})

export class NextOnEnter {
	
	 constructor(el: ElementRef, renderer: Renderer) {
       renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');
    }
}

