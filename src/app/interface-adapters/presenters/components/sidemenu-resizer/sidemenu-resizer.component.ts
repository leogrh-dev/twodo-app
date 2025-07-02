import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

interface ResizeState {
  isResizing: boolean;
  startX: number;
}

@Component({
  selector: 'app-sidemenu-resizer',
  standalone: true,
  templateUrl: './sidemenu-resizer.component.html',
  styleUrls: ['./sidemenu-resizer.component.scss'],
  imports: [
    CommonModule,
    NzToolTipModule,
  ],
})
export class SidemenuResizerComponent {
  private static readonly MIN_WIDTH = 240;
  private static readonly MAX_WIDTH = 480;
  private static readonly CLICK_THRESHOLD = 5;

  @Input() isCollapsed: boolean = false;
  @Output() resize = new EventEmitter<number>();
  @Output() clicked = new EventEmitter<void>();

  private resizeState: ResizeState = {
    isResizing: false,
    startX: 0,
  };

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.initializeResize(event.clientX);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (!this.resizeState.isResizing) return;

    this.handleResizeEnd(event.clientX);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.resizeState.isResizing) return;

    this.handleResize(event.clientX);
  }

  private initializeResize(clientX: number): void {
    this.resizeState = {
      isResizing: true,
      startX: clientX,
    };
  }

  private handleResizeEnd(clientX: number): void {
    if (this.isClickAction(clientX)) {
      this.clicked.emit();
    }

    this.resetResizeState();
  }

  private handleResize(clientX: number): void {
    const boundedWidth = this.calculateBoundedWidth(clientX);
    this.resize.emit(boundedWidth);
  }

  private isClickAction(clientX: number): boolean {
    const distanceMoved = Math.abs(clientX - this.resizeState.startX);
    return distanceMoved < SidemenuResizerComponent.CLICK_THRESHOLD;
  }

  private calculateBoundedWidth(clientX: number): number {
    return Math.min(
      Math.max(clientX, SidemenuResizerComponent.MIN_WIDTH),
      SidemenuResizerComponent.MAX_WIDTH
    );
  }

  private resetResizeState(): void {
    this.resizeState = {
      isResizing: false,
      startX: 0,
    };
  }
}