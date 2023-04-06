import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NewItemComponent } from './new-item.component';
import { ItemService } from '../item.service';
import { MockItemService
} from 'src/testing/item.service.mock';

describe('NewItemComponent', () => {
  let testComponent: NewItemComponent;
  let fixture: ComponentFixture<NewItemComponent>;
  let formGroup: FormGroup;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(ItemService, { useValue: new MockItemService() });
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
      declarations: [NewItemComponent],
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItemComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    formGroup = testComponent.newItemForm;
    expect(formGroup).toBeDefined();
    expect(formGroup.controls).toBeDefined();
  });

  it('should create', () => {
    expect(testComponent).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(formGroup.valid).toBeFalsy();
  });

  describe('The unit field', () =>{
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = testComponent.newItemForm.controls.unit;
    });

    it ('should not allow blank units', () =>{
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it ('should allow any valid string', () =>{
      nameControl.setValue('lbs');
      expect(nameControl.valid).toBeTruthy();
    });

  });

  describe('The amount field', () =>{
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = testComponent.newItemForm.controls.amount;
    });

    it ('should not allow blank names', () =>{
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it ('should not allow non-numeric characters', () =>{
      nameControl.setValue('Cake');
      expect(nameControl.valid).toBeFalsy();
    });

    it ('should  allow numeric characters', () =>{
      nameControl.setValue('51');
      expect(nameControl.valid).toBeTruthy();
    });
  });

  describe('The itemName field', () =>{
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = testComponent.newItemForm.controls.unit;
    });

    it ('should not allow blank names', () =>{
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it ('should allow any valid string', () =>{
      nameControl.setValue('Cake');
      expect(nameControl.valid).toBeTruthy();
    });

  });

  describe('The getErrorMessage method', ()=>{
    let nameControl: AbstractControl;
    let amountControl: AbstractControl;
    let unitControl: AbstractControl;
    beforeEach(() => {
      amountControl = testComponent.newItemForm.controls.amount;
      unitControl = testComponent.newItemForm.controls.unit;
      nameControl = testComponent.newItemForm.controls.itemName;
    });

    it('should return "unknown error" when there is not an error', ()=> {
      nameControl.setValue('Mason Eischens');
      expect(testComponent.getErrorMessage('itemName') === 'Unknown error');
    });

    it('should return "required" error when itemName is empty', ()=> {
      nameControl.setValue('');
      expect(testComponent.getErrorMessage('itemName')).toBeTruthy();
    });

    it('should return "pattern" error for non-numeric characters', ()=> {
      amountControl.setValue('agsags');
      expect(testComponent.getErrorMessage('amount') === 'Amount must be a number').toBeTruthy();
    });

  });
});
