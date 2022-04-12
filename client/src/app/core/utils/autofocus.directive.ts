import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[autofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private targetElement: ElementRef) {}

  ngAfterViewInit() {
    window.setTimeout(() => {
      this.targetElement.nativeElement.focus();
    });
  }
}
