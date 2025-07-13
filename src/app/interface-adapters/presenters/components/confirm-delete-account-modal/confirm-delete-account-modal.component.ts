import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-account-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-account-modal.component.html',
  styleUrls: ['./confirm-delete-account-modal.component.scss'],
})
export class ConfirmDeleteAccountModalComponent {
  @Input() userEmail = '';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  confirmationText = '';
}