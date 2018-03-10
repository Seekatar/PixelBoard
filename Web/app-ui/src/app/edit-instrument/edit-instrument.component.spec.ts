import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstrumentComponent } from './edit-instrument.component';

describe('EditInstrumentComponent', () => {
  let component: EditInstrumentComponent;
  let fixture: ComponentFixture<EditInstrumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInstrumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInstrumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
