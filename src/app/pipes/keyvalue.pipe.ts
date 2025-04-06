import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectEntries',
  standalone: true,
})
export class ObjectEntriesPipe implements PipeTransform {
  transform(value: object = {}): { key: string; value: any }[] {
    return Object.entries(value).map(([key, value]) => ({ key, value }));
  }
}
