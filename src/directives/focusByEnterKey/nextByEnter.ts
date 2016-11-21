import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
   selector: '[onReturn]'
})
export class FocusByEnterKey {
   private el: ElementRef;
   @Input('onReturn') returnValue: string;
   constructor(private _el: ElementRef) {
       this.el = this._el;
   }
   @HostListener('keydown', ['$event']) onKeyDown(e) {
       if ((e.which == 13 || e.keyCode == 13)) {
           e.preventDefault();
           if (e.srcElement.nextElementSibling) {
            e.srcElement.nextElementSibling.focus();
            }
           else{
           }
           return;
       }
   }

}
