import {Component, Input, Output, EventEmitter} from '@angular/core';
@Component({
    selector: 'btn-full',
    templateUrl: 'buttonFull.html'
})
 /**
  *
  * full width button directive with dynamic title,spinner,color,validation,class **/
export class ButtonFull {
    @Input() titleFull: string = "";
    @Input() colorFull: string = "primary";
    @Input() spinFull: boolean = false;
    @Input() validFull: boolean = false;
    @Input() idFull: string = "";
    @Input() classFull: string = "";
    @Output() onBtnClick = new EventEmitter();
    constructor() {}
    onClick() {
        this.onBtnClick.emit();
    }
}

