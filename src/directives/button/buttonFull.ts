import { Component, Input} from '@angular/core';
@Component({
     selector: 'btnFull',
    templateUrl: 'buttonFull.html'
})
export class Button {
    @Input() title: string;
    @Input() color: string;
    @Input() spin:boolean;
    @Input() valid:boolean;
    constructor() {
       this.onClick();
    }
    onClick(){
    }
}
