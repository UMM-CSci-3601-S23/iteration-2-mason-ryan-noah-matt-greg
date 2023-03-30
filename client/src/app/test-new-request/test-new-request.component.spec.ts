import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestNewRequestComponent } from './test-new-request.component';

describe('TestNewRequestComponent', () => {
  let component: TestNewRequestComponent;
  let fixture: ComponentFixture<TestNewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestNewRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestNewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
