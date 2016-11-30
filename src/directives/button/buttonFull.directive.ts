import { Component, Input , Output, EventEmitter } from '@angular/core';
@Component({
     selector: 'btn-full',
    templateUrl: 'buttonFull.html'
})
export class ButtonFull {
    @Input() titleFull: string;
    @Input() colorFull: string;
    @Input() spinFull:boolean;
    @Input() validFull:boolean;
    @Input() idFull:string;
    @Input() classFull:string;
    @Output() functionFull = new EventEmitter();
    constructor() {
    }
    onClick(){
      this.functionFull.emit();
    }
}

