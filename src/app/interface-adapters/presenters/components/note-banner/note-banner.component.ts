import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzColor, NzColorPickerModule } from 'ng-zorro-antd/color-picker';

import { NoteStateService } from '../../../../core/services/note-state.service';
import { COLOR_CATEGORIES, BannerColorCategory } from './banner-options';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-note-banner',
  standalone: true,
  templateUrl: './note-banner.component.html',
  styleUrls: ['./note-banner.component.scss'],
  imports: [
    CommonModule,
    NzTabsModule,
    NzDropDownModule,
    NzButtonModule,
    NzColorPickerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteBannerComponent {
  private readonly noteState = inject(NoteStateService);

  colorCategories: BannerColorCategory[] = COLOR_CATEGORIES;
  showMenu = signal(false);
  activeTab = signal<'gallery' | 'upload'>('gallery');

  private readonly noteSignal = toSignal(this.noteState.note$, { initialValue: null });

  readonly currentBanner = computed(() => this.noteSignal()?.bannerUrl ?? null);
  readonly hasBanner = computed(() => !!this.currentBanner());

  readonly customColor = computed(() => {
    const banner = this.currentBanner();
    return banner?.startsWith('#') ? banner : '#000000';
  });

  toggleMenu(): void {
    this.showMenu.set(!this.showMenu());
  }

  selectTab(tab: 'gallery' | 'upload'): void {
    this.activeTab.set(tab);
  }

  onSelectColor(color: string): void {
    this.noteState.updateBanner(color);
    this.showMenu.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.uploadFile(file).then((url) => {
      this.noteState.updateBanner(url);
      this.showMenu.set(false);
    });
  }

  removeBanner(): void {
    this.noteState.removeBanner();
    this.showMenu.set(false);
  }

  handleColorPick(event: { color: NzColor; format: string }): void {
    const hex = event.color.toHexString();
    this.onSelectColor(hex);
  }

  private async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(environment.uploadUri, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.url;
  }
}
