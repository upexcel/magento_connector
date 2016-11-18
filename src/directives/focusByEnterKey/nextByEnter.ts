  
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
           console.log(e);
       console.log(this.el);
           console.log(this.returnValue);
           if (e.srcElement.nextElementSibling) {
            e.srcElement.nextElementSibling.focus();
            e.srcElement.nextElementSibling.focus();
            //console.log(e.srcElement);
            console.log(e.srcElement.nextElementSibling);
            if(el.lastElementChild)
           }
           else{
               console.log('close keyboard');
           }
           return;
       }

//        if ((e.which == 32)) {
//            e.preventDefault();
//            if (e.srcElement.nextElementSibling) {
//                e.srcElement.nextElementSibling.focus();
//            }
//            else{
//                console.log('close keyboard');
//            }
//            return;
//        }



   }

}
