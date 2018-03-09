import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneConfigComponent } from './scene-config.component';

describe('SceneConfigComponent', () => {
  let component: SceneConfigComponent;
  let fixture: ComponentFixture<SceneConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
