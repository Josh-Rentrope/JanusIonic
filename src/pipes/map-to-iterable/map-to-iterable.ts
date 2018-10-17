import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the MapToIterablePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'mapToIterable',
})
export class MapToIterablePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any): any {
    if(value === null) {
      return null;
    } else {
      return Object.keys(value).map(key => value[key]);
    }
  }
}
