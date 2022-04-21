import { Pipe, PipeTransform } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd/i18n';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslationPipe implements PipeTransform {
  constructor(private translationService: NzI18nService) {}

  transform(value: string): string {
    return this.translationService.translate(value);
  }
}
