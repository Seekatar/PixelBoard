import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentConfigComponent } from './instrument-config.component';

describe('InstrumentConfigComponent', () => {
  let component: InstrumentConfigComponent;
  let fixture: ComponentFixture<InstrumentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrumentConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
