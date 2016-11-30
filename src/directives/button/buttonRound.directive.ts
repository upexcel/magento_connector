import { Component, Input , Output, EventEmitter } from '@angular/core';
@Component({
     selector: 'btn',
    templateUrl: 'button.html'
})
export class Button {
    @Input() title: string;
    @Input() color: string;
    @Input() spin:boolean;
    @Input() valid:boolean;
    @Input() id:string;
    @Input() class:string;
    @Input() otherDirective:any;
    @Output() function = new EventEmitter();
    constructor() {
    }
    onClick(){
      this.function.emit();
    }
}
