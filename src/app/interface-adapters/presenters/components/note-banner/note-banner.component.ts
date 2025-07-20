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

  // ==============================
  // Signals de estado da interface
  // ==============================

  readonly showMenu = signal(false);
  readonly activeTab = signal<'gallery' | 'upload'>('gallery');

  readonly iconMenuVisible = signal(false);
  readonly iconTab = signal<'emoji' | 'upload'>('emoji');

  // ==============================
  // Dados estáticos (categorias)
  // ==============================

  readonly colorCategories: BannerColorCategory[] = COLOR_CATEGORIES;
  readonly emojiCategories: EmojiCategory[] = ICON_CATEGORIES;

  // ==============================
  // Computed: Estado atual da nota
  // ==============================

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

  // ==============================
  // Tabs de banner e ícone
  // ==============================

  /** Alterna entre galeria e upload no menu de banner */
  selectTab(tab: 'gallery' | 'upload') {
    this.activeTab.set(tab);
  }

  /** Alterna entre emoji e upload no menu de ícone */
  selectIconTab(tab: 'emoji' | 'upload') {
    this.iconTab.set(tab);
  }

  // ==============================
  // Ações de banner
  // ==============================

  /** Altera visibilidade do menu de banner */
  toggleMenu() {
    this.showMenu.set(!this.showMenu());
  }

  /** Aplica uma cor como banner */
  async onSelectColor(color: string) {
    await this.noteStateService.replaceBanner(color);
    this.showMenu.set(false);
  }

  /** Trata a escolha de cor do color picker */
  handleColorPick(event: { color: NzColor; format: string }) {
    this.onSelectColor(event.color.toHexString());
  }

  /** Faz upload de imagem para o banner */
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const url = await this.uploadFile(file);
    await this.noteStateService.replaceBanner(url);
    this.showMenu.set(false);
  }

  /** Remove o banner atual */
  async removeBanner() {
    await this.noteStateService.removeBanner();
    this.showMenu.set(false);
  }

  // ==============================
  // Ações de ícone
  // ==============================

  /** Altera visibilidade do menu de ícone */
  toggleIconMenu() {
    this.iconMenuVisible.set(!this.iconMenuVisible());
  }

  /** Aplica emoji como ícone */
  async onSelectEmoji(emoji: string) {
    await this.noteStateService.replaceIcon(emoji);
    this.iconMenuVisible.set(false);
  }

  /** Faz upload de imagem como ícone */
  async onIconFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const url = await this.uploadFile(file);
    await this.noteStateService.replaceIcon(url);
    this.iconMenuVisible.set(false);
  }

  /** Remove o ícone atual */
  async removeIcon() {
    await this.noteStateService.removeIcon();
    this.iconMenuVisible.set(false);
  }

  // ==============================
  // Utilitários
  // ==============================

  /** Verifica se valor é emoji ou URL */
  isEmoji(value: string): boolean {
    return !value.startsWith('http');
  }

  /** Faz upload do arquivo e retorna URL pública */
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