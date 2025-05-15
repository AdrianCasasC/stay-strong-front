import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  /* Injections */
  private readonly _notificationService = inject(NotificationService);

  /* Signals */
  notification = this._notificationService.notification;

  onCloseNotification(): void {
    this._notificationService.closeNotification();
  }
}
