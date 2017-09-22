import {Directive, HostListener, Input} from '@angular/core';
import {TextInput} from 'ionic-angular';
@Directive({
    selector: '[onReturn]'
})

export class FocusByEnterKey {
    @Input('onReturn') id: string;
    inputRef: TextInput;
    constructor(inputRef: TextInput) {
        this.inputRef = inputRef;
    }

    @HostListener('keydown', ['$event']) onInputChange(e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
             if (this.id != "btn") {
            e.preventDefault();
            this.inputRef.focusNext();
             }else{
                 
             }
        }
    }
}

