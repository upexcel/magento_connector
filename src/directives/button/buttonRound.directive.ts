import { Component, Input , Output, EventEmitter } from '@angular/core';
@Component({
     selector: 'btn-round',
    templateUrl: 'button.html'
})
export class Button {
    @Input() title: string;
    @Input() color: string;
    @Input() spin:boolean;
    @Input() valid:boolean;
    @Input() id:string;
    @Input() class:string;
    @Output() function = new EventEmitter();
    constructor() {
    }
    onClick(){
      this.function.emit();
    }
}
