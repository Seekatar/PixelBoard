import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSceneComponent } from './live-scene.component';

describe('LiveSceneComponent', () => {
  let component: LiveSceneComponent;
  let fixture: ComponentFixture<LiveSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
