import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-details-layout-page',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './details-layout-page.component.html',
  styleUrl: './details-layout-page.component.scss',
})
export class DetailsLayoutPageComponent {}
