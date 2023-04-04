// import {Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup,  } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormService } from './form.service';
import { Form } from './form';
import { RequestService } from '../requests/request.service';


/** @title Checkboxes with reactive forms */
@Component({
  selector: 'app-form-client',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.scss']
})

export class ClientFormComponent {

  form = this.formBuilder.group({
    clientName:['anonymous', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ])],
    familySize:['', Validators.compose([
      Validators.required,
      Validators.min(1),
      Validators.max(99)
    ])],
    diaperSize: 0,
  });

  newRequestValidationMessages = {
    clientName: [
      {type: 'required', message: 'Name is required'},
      {type: 'minlength', message: 'Name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Name cannot be more than 50 characters long'},
    ],
    household: [
      {type: 'required', message: 'Household size is required'},
      {type: 'min', message: 'Household size must be greater than 0'},
      {type: 'max', message: 'Household size must be less than 21'}
    ]
  };

  selections: string[] = new Array();
  isLinear = false;
  diapers = false;
  diaperSize = '1';

  constructor(private formBuilder: FormBuilder,
    private snackBar: MatSnackBar, private router: Router, private requestService: RequestService){
    }


  formControlHasError(controlName: string): boolean {
    return this.form.get(controlName).invalid &&
      (this.form.get(controlName).dirty || this.form.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.newRequestValidationMessages): string {
    for(const {type, message} of this.newRequestValidationMessages[name]) {
      if (this.form.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    const date: Date = new Date();
    const myDate: string = (date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString());
    console.log(myDate);
    const newRequest = {selections: this.selections, timeSubmitted: myDate, name: this.form.get('clientName').getRawValue()};
    console.log(newRequest);
    this.requestService.addRequest(newRequest).subscribe({
      next: (newId) => {
        this.snackBar.open(
          `Request successfully submitted`,
          null,
          { duration: 2000 }
        );
        // this.router.navigate(['/requests', newId]);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 20000 }
        );
      },
      complete: () => console.log('Add user completes!')
    });
  }

  updateDiapers(): void{
    if (this.diapers){
      this.diapers = false;
    }
    else {this.diapers = true;}
  }
  updateList(newItem: string): void{
    console.log('updating list...');
    console.log(this.selections);
    if (newItem === 'diapers'){
      this.updateDiapers();
    }
    if (this.selections.length !== 0 && this.selections.includes(newItem)){
      this.selections.splice(this.selections.indexOf(newItem));
    }
    else{
      this.selections.push(newItem);
    }
    console.log(this.selections);
  }

}
