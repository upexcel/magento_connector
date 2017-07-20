import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'btn-tour',
    templateUrl: 'buttonTakeTour.html'
})
/** 
*
* take tour button directive with dynamic title,spinner,color,validation,class
**/
export class ButtonTour {
    @Input() titleTour: string = "";
    @Input() colorTour: string = "primary";
    @Input() spinTour: boolean = false;
    @Input() validTour: boolean = false;
    @Input() idTour: string = "";
    @Input() classTour: string = "";
    @Output() onBtnClick = new EventEmitter();
    constructor() {
    }
    onClick() {
        this.onBtnClick.emit();
    }
}