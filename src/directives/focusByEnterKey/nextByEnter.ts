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
            if (this.id != "btn") {
                e.preventDefault();
                var ele = document.getElementById(this.id);
                    for (let i = 0; i < ele.childNodes.length; i++) {
                    let FatchTagName = ele.childNodes[i].nodeName;
                    if(FatchTagName=="INPUT"){
                    console.log(ele.childNodes[i])
                    //ele.childNodes[i].click();
                    break;
                    }
    }
                return;
            }
            else {

            }
        }

    }
}
