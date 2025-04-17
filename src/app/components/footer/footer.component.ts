import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FooterTab } from '../../models/models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  /* Injections */
  private readonly _router = inject(Router);

  /* Signal Inputs */
  dayId = input<string>();
  dayDate = input<string>();

  tabs: FooterTab[] = ['home', 'list', 'training'];
  selectedTab: FooterTab = 'list';

  onSelectTab(tab: FooterTab): void {
    this.selectedTab = tab;
    if (tab === 'home') {
      this._router.navigateByUrl('/home');
    } else {
      this._router.navigateByUrl(
        `details/${this.dayId()}/${this.dayDate()}/${tab}`
      );
    }
  }
}
