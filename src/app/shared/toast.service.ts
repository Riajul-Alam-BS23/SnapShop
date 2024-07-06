import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private displayedMessages: Set<string> = new Set();
  constructor(private toast: MessageService) {}
  showToast(type: string, heading: string, message: string) {
    const displayMessage = `${type}-${heading}-${message}`;

    if (!this.displayedMessages.has(displayMessage)) {
      this.displayedMessages.add(displayMessage);
      this.toast.add({
        severity: type,
        summary: heading,
        detail: message,
        life: 3000,
      });

      // Remove the message from the set after it disappears
      setTimeout(() => {
        this.displayedMessages.delete(displayMessage);
      }, 3000);
    }
  }
}
