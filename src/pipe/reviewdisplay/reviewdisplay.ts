import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'singleDecimal'})
export class ReviewDisplayPipe implements PipeTransform {
  constructor() { }
  transform(input: any): any {
    if (!input) return input;
	return Math.round(input * 10) / 10;
  }
}