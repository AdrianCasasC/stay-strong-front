import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Input('clickOutsideIgnoreById') ignoreElementsIdList: string[] = [];
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    const ignoreElements: HTMLElement[] = this.ignoreElementsIdList
      .map((id) => document.getElementById(id) as HTMLElement)
      .filter((element) => element !== null && element !== undefined);
    // Check if the click is outside the element
    if (
      targetElement &&
      !this.elementRef.nativeElement.contains(targetElement) &&
      !ignoreElements.some((el) => el.contains(targetElement))
    ) {
      this.clickOutside.emit();
    }
  }
}
