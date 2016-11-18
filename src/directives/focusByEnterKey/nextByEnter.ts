  
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
   selector: '[onReturn]'
})
export class FocusByEnterKey {
   private el: ElementRef;
   @Input() onReturn: string;
   constructor(private _el: ElementRef) {
       this.el = this._el;
   }
   @HostListener('keydown', ['$event']) onKeyDown(e) {
       if ((e.which == 13 || e.keyCode == 13)) {
           e.preventDefault();
           if (e.srcElement.nextElementSibling) {
           console.log("preventDefault")
               e.srcElement.nextElementSibling.focus();
            e.srcElement.nextElementSibling.focus();
           }
           else{
               console.log('close keyboard');
           }
           return;
       }
   }

}

