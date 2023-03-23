import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockRequestService } from 'src/testing/request.service.mock';;
import { RequestService } from '../request.service';
import { NewRequestComponent } from './new-request.component';

describe('NewRequestComponent', () => {
  let newRequestComponent: NewRequestComponent;
  let newRequestForm: FormGroup;
  let fixture: ComponentFixture<NewRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(RequestService, { useValue: new MockRequestService() });
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
      declarations: [NewRequestComponent],
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRequestComponent);
    newRequestComponent = fixture.componentInstance;
    fixture.detectChanges();
    newRequestForm = newRequestComponent.newRequestForm;
    expect(newRequestForm).toBeDefined();
    expect(newRequestForm.controls).toBeDefined();
  });

  // Not terribly important; if the component doesn't create
  // successfully that will probably blow up a lot of things.
  // Including it, though, does give us confidence that our
  // our component definitions don't have errors that would
  // prevent them from being successfully constructed.
  it('should create the component and form', () => {
    expect(newRequestComponent).toBeTruthy();
    expect(newRequestForm).toBeTruthy();
  });

  // Confirms that an initial, empty form is *not* valid, so
  // people can't submit an empty form.
  it('form should be invalid when empty', () => {
    expect(newRequestForm.valid).toBeFalsy();
  });

  describe('The description field', () => {
    let descControl: AbstractControl;

    beforeEach(() => {
      descControl = newRequestComponent.newRequestForm.controls.description;
    });

    it('should not allow empty descriptions', () => {
      descControl.setValue('');
      expect(descControl.valid).toBeFalsy();
    });

    it('should not descriptions with less than 5 chars', () => {
      descControl.setValue('tysm');
      expect(descControl.valid).toBeFalsy();
    });

    it('should be fine with "Nature valley bars"', () => {
      descControl.setValue('Nature valley bars');
      expect(descControl.valid).toBeTruthy();
    });

    // In the real world, you'd want to be pretty careful about
    // setting upper limits on things like name lengths just
    // because there are people with really long names.
    it('should fail on really long descriptions', () => {
      descControl.setValue('x'.repeat(400));
      expect(descControl.valid).toBeFalsy();
      // Annoyingly, Angular uses lowercase 'l' here
      // when it's an upper case 'L' in `Validators.maxLength(2)`.
      expect(descControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the description', () => {
      descControl.setValue('Bad2Th3B0ne');
      expect(descControl.valid).toBeTruthy();
    });
  });

  describe('The itemType field', () => {
    let itemTypeControl: AbstractControl;

    beforeEach(() => {
      itemTypeControl = newRequestForm.controls.itemType;
    });

    it('should not allow empty values', () => {
      itemTypeControl.setValue('');
      expect(itemTypeControl.valid).toBeFalsy();
      expect(itemTypeControl.hasError('required')).toBeTruthy();
    });

    it('should allow "food"', () => {
      itemTypeControl.setValue('food');
      expect(itemTypeControl.valid).toBeTruthy();
    });

    it('should allow "toiletries"', () => {
      itemTypeControl.setValue('toiletries');
      expect(itemTypeControl.valid).toBeTruthy();
    });

    it('should allow "other"', () => {
      itemTypeControl.setValue('other');
      expect(itemTypeControl.valid).toBeTruthy();
    });

    it('should not allow "cars"', () => {
      itemTypeControl.setValue('cars');
      expect(itemTypeControl.valid).toBeFalsy();
    });
  });

  describe('The foodType field', () => {
    let foodTypeControl: AbstractControl;

    beforeEach(() => {
      foodTypeControl = newRequestForm.controls.foodType;
    });

    it('should allow empty values', () => {
      foodTypeControl.setValue('');
      expect(foodTypeControl.valid).toBeTruthy();
    });

    it('should allow "dairy"', () => {
      foodTypeControl.setValue('dairy');
      expect(foodTypeControl.valid).toBeTruthy();
    });

    it('should allow "grain"', () => {
      foodTypeControl.setValue('grain');
      expect(foodTypeControl.valid).toBeTruthy();
    });

    it('should allow "meat"', () => {
      foodTypeControl.setValue('meat');
      expect(foodTypeControl.valid).toBeTruthy();
    });

    it('should allow "fruit"', () => {
      foodTypeControl.setValue('fruit');
      expect(foodTypeControl.valid).toBeTruthy();
    });

    it('should allow "vegetable"', () => {
      foodTypeControl.setValue('vegetable');
      expect(foodTypeControl.valid).toBeTruthy();
    });

    it('should not allow "cars"', () => {
      foodTypeControl.setValue('cars');
      expect(foodTypeControl.valid).toBeFalsy();
    });
  });
  describe('The getErrorMessage method', ()=>{
    let itemTypeControl: AbstractControl;

    beforeEach(() => {
      itemTypeControl = newRequestForm.controls.itemType;
    });

    it('should return "unknown error" when passed an invalid error code', ()=> {
      expect(newRequestComponent.getErrorMessage('foodType') === 'Unknown error');
    });

    it('should return "required" error when itemType is empty', ()=> {
      itemTypeControl.setValue('--');
      expect(newRequestComponent.getErrorMessage('itemType')).toBeTruthy();
    });
  });
});

