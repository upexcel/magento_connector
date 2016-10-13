 import { Pipe, PipeTransform } from '@angular/core';
 import  _ from 'lodash';
 import { Storage } from '@ionic/storage';
 @Pipe({ name: 'filter' })
 export class filter implements PipeTransform {
     lists:any;
      constructor(public local: Storage){
          
      }
    transform(obj: any ): any { 
        this.local.get('search').then((value: any) => {
            this.lists = _.uniq(value);
            _.forEach(this.lists , function(value, key) {
                console.log(key);
                console.log(value);
                console.log(obj);
            });
        });
//        console.log(obj);
//        console.log(attribute);
           return obj; 
           }
 }
