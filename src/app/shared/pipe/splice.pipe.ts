import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splice',
})
export class SplicePipe implements PipeTransform {
  transform(value: string, start: number, end?: number): string {
    if (!value) return '';
    return value.substring(start, end);
  }
}
