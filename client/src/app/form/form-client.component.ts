// import {Component} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup,  } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormService } from './form.service';
import { Form } from './form';



/** @title Checkboxes with reactive forms */
@Component({
  selector: 'app-form-client',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.scss']
})

export class ClientFormComponent {

  form = this.formBuilder.group({
    clientName:['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ])],
    diaperSize: 0,
  });

  newRequestValidationMessages = {
    clientName: [
      {type: 'required', message: 'Name is required'},
      {type: 'minlength', message: 'Name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Name cannot be more than 50 characters long'},
    ]
  };

  selections: string[] = new Array();
  isLinear = false;
  diapers = false;
  diaperSize = '1';
  date: Date = new Date();
  done = false;

  constructor(private formBuilder: FormBuilder,
    private snackBar: MatSnackBar, private router: Router, private formService: FormService){
    }


  formControlHasError(controlName: string): boolean {
    return this.form.get(controlName).invalid &&
      (this.form.get(controlName).dirty || this.form.get(controlName).touched);
  }

  getErrorMessage(name: string): string {
    for(const {type, message} of this.newRequestValidationMessages[name]) {
      if (this.form.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    let month: string = this.date.getMonth().toString();
    let day: string = this.date.getDate().toString();
    if (month.length !== 2){
      month = '0' + month;
    }
    if (day.length !== 2){
      day = '0' + day;
    }
    const myDate: string = (this.date.getFullYear().toString()+  month + day);
    console.log(myDate);
    const newForm = {selections: this.selections, timeSubmitted: myDate, name: this.form.get('clientName').getRawValue()};
    this.formService.addForm(newForm).subscribe({
      next: (newId) => {
        this.snackBar.open(
          `Request successfully submitted`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/requests/volunteer']);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 20000 }
        );
      },
      complete: () => this.done = true
    });
  }

  updateDiapers(): void{
    if (this.diapers){
      this.diapers = false;
    }
    else {this.diapers = true;}
  }

  updateList(newItem: string): void{
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
