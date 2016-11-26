import { Directive, ElementRef, HostListener, Input } from '@angular/core';
declare var Zepto: any;
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
                var form = Zepto('#' + this.id)
                form.find('input, select').focus();

            }
            else {
                //  console.log('submit');
            }
        }

    }
}
