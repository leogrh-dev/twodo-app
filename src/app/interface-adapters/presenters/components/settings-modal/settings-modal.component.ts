import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  signal,
  computed,
  OnInit,
  inject,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';

import { SettingsAccountPanelComponent } from '../settings-account-panel/settings-account-panel.component';
import { SettingsPreferencesPanelComponent } from '../settings-preferences-panel/settings-preferences-panel.component';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
  imports: [CommonModule, SettingsAccountPanelComponent, SettingsPreferencesPanelComponent]
})
export class SettingsModalComponent implements OnInit, OnDestroy {
  readonly destroyRef = inject(DestroyRef);
  readonly selected = signal<'account' | 'preferences'>('account');

  @Output() close = new EventEmitter<void>();

  readonly isAccountSelected = computed(() => this.selected() === 'account');

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  select(tab: 'account' | 'preferences') {
    this.selected.set(tab);
  }

  private readonly handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') this.close.emit();
  };

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('settings-modal-backdrop')) {
      this.close.emit();
    }
  }
}