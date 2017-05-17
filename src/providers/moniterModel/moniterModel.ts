import { Injectable } from '@angular/core';
import pull from 'lodash/pull';
import forEach from 'lodash/forEach';
@Injectable()

export class ModelService {
	data:any=[];
    constructor() { }
isActive(){
	console.log("this.data",this.data)
return this.data.length;
}
setState(modelName){
	var flag=0;
	if(this.data && this.data.length){
		forEach(this.data,(value)=>{
			if(modelName==value){
				flag=1;
			}
		})
		if(!flag){
		this.data.push(modelName);
		}
	}else{
		this.data.push(modelName);
	}

console.log("set",this.data)
}
unsetState(modelName){
	console.log(this.data)
pull(this.data,modelName);
console.log("pull(this.data,modelName)",pull(this.data,modelName))
}
modelData(){
	return this.data.pop();
}
}