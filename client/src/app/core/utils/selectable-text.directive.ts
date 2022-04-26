import {
  Directive,
  HostListener,
  AfterViewInit,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[selectableTextInCdkDrag]',
})
export class SelectableTextInCdkDragDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  stopPropogation($event: Event): void {
    $event.stopPropagation();
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.style['user-select'] = 'text';
    this.elementRef.nativeElement.style['cursor'] = 'initial';
  }
}
