import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneInputWithDdiSelectorComponent } from './phone-input-with-ddi-selector.component';

describe('PhoneInputWithDdiSelectorComponent', () => {
  let component: PhoneInputWithDdiSelectorComponent;
  let fixture: ComponentFixture<PhoneInputWithDdiSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneInputWithDdiSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneInputWithDdiSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
