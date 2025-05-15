import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  type = input<LoaderType>('dots');
  color = input<string>('');

  getLoaderColor(): string {
    return `--loader-${this.type()}-color: ${this.color()}`
  }
}

type LoaderType = 'dots' | 'line';
