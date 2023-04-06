import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientFormComponent } from './form-client.component';
import { FormService } from './form.service';
import { MockFormService } from 'src/testing/form.service.mock';

describe('ClientFormComponent', () => {
  let testComponent: ClientFormComponent;
  let formGroup: FormGroup;
  let fixture: ComponentFixture<ClientFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(FormService, { useValue: new MockFormService() });
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [ClientFormComponent],
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFormComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    formGroup = testComponent.form;
    expect(formGroup).toBeDefined();
    expect(formGroup.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(testComponent).toBeTruthy();
    expect(formGroup).toBeTruthy();
  });

  // Confirms that an initial, empty form is *not* valid, so
  // people can't submit an empty form.
  it('form should be invalid when empty', () => {
    expect(formGroup.valid).toBeFalsy();
  });

  describe('The name field', () =>{
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = testComponent.form.controls.clientName;
    });

    it ('should not allow blank names', () =>{
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it ('should not allow really short names', () =>{
      nameControl.setValue('M');
      expect(nameControl.valid).toBeFalsy();
    });

    it ('should allow names between 2 and 50 characters', () =>{
      nameControl.setValue('Mason Eischens');
      expect(nameControl.valid).toBeTruthy();
    });

    it ('should not allow really long names', () =>{
      nameControl.setValue('MASON EISCHENS TO THE MOON, I LOVE DOGECOIN AND ELON MUSK WOOOOOOOO TAKE MY MONEY TESLA');
      expect(nameControl.valid).toBeFalsy();
    });
  });

  describe('The getErrorMessage method', ()=>{
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = testComponent.form.controls.clientName;
    });

    it('should return "unknown error" when there is not an error', ()=> {
      nameControl.setValue('Mason Eischens');
      expect(testComponent.getErrorMessage('clientName') === 'Unknown error');
    });

    it('should return "required" error when name is empty', ()=> {
      nameControl.setValue('');
      expect(testComponent.getErrorMessage('clientName')).toBeTruthy();
    });

    it('should return "minlength" error when name too short', ()=> {
      nameControl.setValue('A');
      expect(testComponent.getErrorMessage('clientName')).toBeTruthy();
    });

    it('should return "maxlength" error when name is too long', ()=> {
      nameControl.setValue('MASON EISCHENS TO THE MOON, I LOVE DOGECOIN AND ELON MUSK WOOOOOOOO TAKE MY MONEY TESLA');
      expect(testComponent.getErrorMessage('clientName')).toBeTruthy();
    });
  });

  describe('The updateDiapers method', ()=>{

    beforeEach(() => {
      testComponent.diapers = false;
    });

    it('correctly changes diapers to true when it\'s false', ()=> {
      testComponent.updateDiapers();
      expect(testComponent.diapers).toBeTruthy();
    });

    it('correctly changes diapers to false when it\'s true', ()=> {
      testComponent.diapers = true;
      testComponent.updateDiapers();
      expect(testComponent.diapers).toBeFalsy();
    });

  });

  describe('The updateList method', ()=>{

    beforeEach(() => {
      testComponent.selections = ['hotSauce', 'rice', 'bread'];
    });

    it('correctly adds items to selections', ()=> {
      testComponent.updateList('tomatoSoup');
      expect(testComponent.selections.includes('tomatoSoup')).toBeTruthy();
    });

    it('correctly removes items from selections', ()=> {
      testComponent.updateList('hotSauce');
      expect(testComponent.selections.includes('hotSauce')).toBeFalsy();
    });

    it('behaves correctly when newItem = diapers', ()=> {
      testComponent.updateList('diapers');
      expect(testComponent.diapers).toBeTruthy();
    });

  });

  describe('The submitForm method', ()=>{
    const date: Date = new Date();
    const shortMonth = 5;
    const shortDay = 3;
    beforeEach(() => {
      testComponent.selections = ['hotSauce', 'rice', 'bread'];
      testComponent.date = date;
    });

    it('submission goes through successfully', ()=> {
      testComponent.submitForm();
      expect(testComponent.done).toBeTruthy();
    });

  });
});
