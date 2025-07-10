import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzColor, NzColorPickerModule } from 'ng-zorro-antd/color-picker';

import { NoteStateService } from '../../../../core/services/note-state.service';
import { COLOR_CATEGORIES, BannerColorCategory } from './banner-options';
import { ICON_CATEGORIES, EmojiCategory } from './note-icon-options';
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
    NzColorPickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteBannerComponent {
  private readonly noteStateService = inject(NoteStateService);
  private readonly noteSignal = toSignal(this.noteStateService.note$, { initialValue: null });

  // Signals de UI
  readonly showMenu = signal(false);
  readonly activeTab = signal<'gallery' | 'upload'>('gallery');

  readonly iconMenuVisible = signal(false);
  readonly iconTab = signal<'emoji' | 'upload'>('emoji');

  // Dados estáticos
  readonly colorCategories: BannerColorCategory[] = COLOR_CATEGORIES;
  readonly emojiCategories: EmojiCategory[] = ICON_CATEGORIES;

  // Computed: estado atual da nota
  readonly currentBanner = computed(() => this.noteSignal()?.bannerUrl?.trim() || null);
  readonly hasBanner = computed(() => !!this.currentBanner());

  readonly currentIcon = computed(() => {
    const icon = this.noteSignal()?.iconUrl?.trim();
    return icon?.length ? icon : null;
  });
  readonly hasIcon = computed(() => !!this.currentIcon());

  readonly customColor = computed(() =>
    this.currentBanner()?.startsWith('#') ? this.currentBanner()! : '#000000'
  );

  // Métodos de Tabs
  selectTab(tab: 'gallery' | 'upload') {
    this.activeTab.set(tab);
  }

  selectIconTab(tab: 'emoji' | 'upload') {
    this.iconTab.set(tab);
  }

  // Handlers de Banner
  toggleMenu() {
    this.showMenu.set(!this.showMenu());
  }

  async onSelectColor(color: string) {
    await this.noteStateService.replaceBanner(color);
    this.showMenu.set(false);
  }

  handleColorPick(event: { color: NzColor; format: string }) {
    this.onSelectColor(event.color.toHexString());
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const url = await this.uploadFile(file);
    await this.noteStateService.replaceBanner(url);
    this.showMenu.set(false);
  }

  async removeBanner() {
    await this.noteStateService.removeBanner();
    this.showMenu.set(false);
  }

  // Handlers de Ícone
  toggleIconMenu() {
    this.iconMenuVisible.set(!this.iconMenuVisible());
  }

  async onSelectEmoji(emoji: string) {
    await this.noteStateService.replaceIcon(emoji);
    this.iconMenuVisible.set(false);
  }

  async onIconFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const url = await this.uploadFile(file);
    await this.noteStateService.replaceIcon(url);
    this.iconMenuVisible.set(false);
  }

  async removeIcon() {
    await this.noteStateService.removeIcon();
    this.iconMenuVisible.set(false);
  }

  // Utilitários
  isEmoji(value: string): boolean {
    return !value.startsWith('http');
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