import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, Input } from '@angular/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-sidemenu-resizer',
  templateUrl: './sidemenu-resizer.component.html',
  styleUrls: ['./sidemenu-resizer.component.scss'],
  standalone: true,
  imports: [
    NzToolTipModule,
    CommonModule
  ],
})
export class SidemenuResizerComponent {
  @Output() resize = new EventEmitter<number>();
  @Output() clicked = new EventEmitter<void>();
  @Input() isCollapsed: boolean = false;

  private resizing = false;
  private startX = 0;

  constructor(

  ) { }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.resizing = true;
    this.startX = event.clientX;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (!this.resizing) return;

    const moved = Math.abs(event.clientX - this.startX) < 5;
    if (moved) {
      this.clicked.emit();
    }

    this.resizing = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.resizing) return;

    const newWidth = event.clientX;
    const minWidth = 240;
    const maxWidth = 480;

    const boundedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
    this.resize.emit(boundedWidth);
  }
}