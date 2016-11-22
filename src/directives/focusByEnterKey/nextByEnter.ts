import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
   selector: '[onReturn]'
})
export class FocusByEnterKey {
   private el: ElementRef;
   @Input('onReturn') id: string;
   constructor(private _el: ElementRef) {
       this.el = this._el;
   }
   @HostListener('keydown', ['$event']) onKeyDown(e) {
       if ((e.which == 13 || e.keyCode == 13)) {
        if (this.id!=100) {
         e.preventDefault();
         var ele= document.getElementById(this.id);
           let child=ele.childNodes[0];
           child.focus();
           return;
       }
       else{
       }
       }

   }
}
