import { Component } from '@angular/core';

@Component({
  selector: 'data',
  template:''
})
export class Data {
  text: string;
  constructor(public title: string, public details: string, public icon: string, public showDetails: boolean){
  }
}
