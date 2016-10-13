import { Component } from '@angular/core';

@Component({
  selector: 'data',
  templateUrl: 'data.html'
})
export class Data {
  text: string;
  constructor(public title: string, public details: string, public icon: string, public showDetails: boolean){
  }
}
