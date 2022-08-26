import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: any): any {
    if(value==1){
      return 'Male'
    }
    if(value==2){
      return 'Female'
    }
    
    return null;
  }
}
