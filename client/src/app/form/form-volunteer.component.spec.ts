import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockFormService } from 'src/testing/form.service.mock';
import { Form } from './form';
import { FormVolunteerComponent } from './form-volunteer.component';
import { FormService } from './form.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';



const COMMON_IMPORTS: unknown[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('Volunteer Form View', () => {
  let formVolunteerList: FormVolunteerComponent;
  let fixture: ComponentFixture<FormVolunteerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [FormVolunteerComponent],
      providers: [{ provide: FormService, useValue: new MockFormService() }]
    });
  });

  beforeEach(waitForAsync (() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormVolunteerComponent);
      formVolunteerList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all forms', () => {
    expect(formVolunteerList.serverFilteredForms.length).toBe(4);
  });

  it('contains a form with name Chris Pine', () => {
    expect(formVolunteerList.serverFilteredForms.some((form: Form) => form.name === 'Chris Pine')).toBe(true);
  });

  it('doesn\'t contains a form with name Thor', () => {
    expect(formVolunteerList.serverFilteredForms.some((form: Form) => form.name === 'Thor')).toBe(false);
  });

  it('contains a form with timeSubmitted 20190604', () => {
    expect(formVolunteerList.serverFilteredForms.some((form: Form) => form.timeSubmitted === 'submitted a form on: 06-04-2019')).toBe(true);
  });

});

describe('Misbehaving Volunteer view', () => {
  let formVolunteerList: FormVolunteerComponent;
  let fixture: ComponentFixture<FormVolunteerComponent>;

  it('generates an error if we don\'t set up a FormVolunteerService', () => {
    expect(formVolunteerList.serverFilteredForms).toBeUndefined();
  });

});


describe('makeFormsReadable works as expected', ()=>{
  let formVolunteerList: FormVolunteerComponent;
  let fixture: ComponentFixture<FormVolunteerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [FormVolunteerComponent],
      providers: [{ provide: FormService, useValue: new MockFormService() }]
    });
  });

  beforeEach(waitForAsync (() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormVolunteerComponent);
      formVolunteerList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('makeFormsReadable properly processes date values', ()=>{
    const alteredTestForms: Form[] = formVolunteerList.makeFormsReadable(formVolunteerList.serverFilteredForms);
    expect(alteredTestForms[1].timeSubmitted !== '20190604').toBeTruthy();
    expect(alteredTestForms[1].timeSubmitted === 'submitted a form on: 06-04-2019').toBeTruthy();
  });

  it('makeFormsReadable properly processes selections values', ()=>{
    const testForms2: Form[] = [
      {
        _id: '1_id',
        name: 'Chris Pine',
        selections: [
          'miscSnacks',
          'bread',
          'greenBeans'
        ],
        timeSubmitted: '20180604'
      },
      {
        _id: '2_id',
        name: 'Micheal Cera',
        selections: [
          'yogurt',
          'cheese',
          'carrots'
        ],
        timeSubmitted: '20190604'
      },
      {
        _id: '3_id',
        name: 'Margot Robbie',
        selections: [
          'hotSauce',
          'bakedGoods',
          'milk'
        ],
        timeSubmitted: '20170604'
      },
      {
        _id: '4_id',
        name: 'John Cena',
        selections: [
          'tomatoSoup',
          'groundBeef',
          'corn'
        ],
        timeSubmitted: '20200604'
      }
    ];
    const alteredTestForms2: Form[] = formVolunteerList.makeFormsReadable(testForms2);
    expect(alteredTestForms2[3].selections[0] !== 'tomatoSoup').toBeTruthy();
    expect(alteredTestForms2[3].selections[0] === ' Tomato soup').toBeTruthy();
  });
});


