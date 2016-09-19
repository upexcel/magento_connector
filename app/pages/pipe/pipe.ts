import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({ name: 'filter' })

export class filter implements PipeTransform {
    transform(obj: any , attribute: any): any { 
//        console.log(attribute.length);
//        if(attribute.length>0){
//        return attribute;
//        }
//        else{
//           return obj; 
//        }
    }
}
