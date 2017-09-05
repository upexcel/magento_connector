import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'btn-round',
    templateUrl: 'button.html'
})
/** 
*
* round  button directive with dynamic title,spinner,color,validation,class
**/
export class Button {
    @Input() title: string = "";
    @Input() color: string = "primary";
    @Input() spin: boolean = false;
    @Input() valid: boolean = false;
    @Input() id: string = "";
    @Input() class: string = "";
    @Input() category;
    @Output() onBtnClick = new EventEmitter();
    constructor() {
    }
    onClick() {
        this.onBtnClick.emit();
    }
}
