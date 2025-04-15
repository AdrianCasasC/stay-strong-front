import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterTab } from '../../models/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  dayId = input<string>();
  tabs: FooterTab[] = ['home', 'detail', 'training'];
  selectedTab: FooterTab = 'detail';

  onSelectTab(tab: FooterTab): void {
    this.selectedTab = tab;
  }
}
