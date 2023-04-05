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

const testForms: Form[] = [
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

});

describe('Misbehaving Volunteer view', () => {
  let formVolunteerList: FormVolunteerComponent;
  let fixture: ComponentFixture<FormVolunteerComponent>;

  let formServiceStub: {
    getForms: () => Observable<Form[]>;
  };

  beforeEach(() => {
    formServiceStub = {
      getForms: () => new Observable(observer => {
        observer.error('getForms() Observer generates an error');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [FormVolunteerComponent],
      providers: [{provide: FormService, useValue: formServiceStub}]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FormVolunteerComponent);
      formVolunteerList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a FormVolunteerService', () => {
    expect(formVolunteerList.serverFilteredForms).toBeUndefined();
  });

  it('updateFilter properly reassigns our form list', ()=>{
    formVolunteerList.updateFilter();
    expect(formVolunteerList.filteredForms === formVolunteerList.serverFilteredForms).toBeTruthy();
  });

});

describe('makeFormsReadable works', ()=>{
  let formVolunteerList: FormVolunteerComponent;
  let fixture: ComponentFixture<FormVolunteerComponent>;

  it('makeFormsReadable properly processes date values', ()=>{
    const alteredTestForms: Form[] = formVolunteerList.makeFormsReadable(testForms);
    expect(alteredTestForms[1].timeSubmitted !== '20190604').toBeTruthy();
    expect(alteredTestForms[1].timeSubmitted !== 'submitted a form: 06-04-2019').toBeTruthy();
  });
});
