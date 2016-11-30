import { Component, Input , Output, EventEmitter } from '@angular/core';
@Component({
     selector: 'btn-tour',
    templateUrl: 'buttonTakeTour.html'
})
export class ButtonTour {
    @Input() titleTour: string;
    @Input() colorTour: string;
    @Input() spinTour:boolean;
    @Input() validTour:boolean;
    @Input() idTour:string;
    @Input() classTour:string;
    @Output() functionTour = new EventEmitter();
    constructor() {
    }
    onClick(){
      this.functionTour.emit();
    }
}