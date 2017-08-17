import {Directive, ElementRef, HostListener, Input} from '@angular/core';
declare var Zepto: any;
import {Platform} from 'ionic-angular';

@Directive({
    selector: '[onReturn]'
})
/**
*this diective is use for fouce on next input filed by press enter key
*/
export class FocusByEnterKey {
    private el: ElementRef;
    @Input('onReturn') id: string;
    constructor(private _platform: Platform, private _el: ElementRef) {
        this.el = this._el;
    }
    @HostListener('keydown', ['$event']) onKeyDown(e) {
        if ((e.which == 13 || e.keyCode == 13)) {
            if (this.id != "btn") {
                e.preventDefault();
                var form = Zepto('#' + this.id);
                if (this._platform.is('android')) {
                    form.find('input,textarea, select')[0].focus();
                }
            }
            else {
                form.find('input,textarea, select').focus();
            }
        }

    }
}
