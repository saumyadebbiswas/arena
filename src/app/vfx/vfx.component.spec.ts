import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VfxComponent } from './vfx.component';

describe('VfxComponent', () => {
  let component: VfxComponent;
  let fixture: ComponentFixture<VfxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VfxComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VfxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
