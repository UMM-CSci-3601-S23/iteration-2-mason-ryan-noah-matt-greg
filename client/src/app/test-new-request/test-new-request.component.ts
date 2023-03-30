// import {Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup,  } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RequestService } from '../requests/request.service';
//import { kStringMaxLength } from 'buffer';


/** @title Checkboxes with reactive forms */
@Component({
  selector: 'app-test-new-request',
  templateUrl: './test-new-request.component.html',
  styleUrls: ['./test-new-request.component.scss']
})

export class TestNewRequestComponent  {
  foods = this.formBuilder.group({
    miscFreshFruit: false, appleJuice: false, frozenPeaches: false
  });

  selections: Array<string>;
  addRequestForm: UntypedFormGroup;
  isLinear = false;


  addTodoValidationMessages = {
    name: [
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

  constructor(private formBuilder: FormBuilder, private fb: UntypedFormBuilder,
   private snackBar: MatSnackBar, private router: Router,
   private requestService: RequestService){}

  submitForm() {
    const newRequest = {selections: this.selections};
    this.requestService.addRequest(newRequest).subscribe({
      next: (newId) => {
        this.snackBar.open(
          `Request successfully submitted`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/requests', newId]);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
      // complete: () => console.log('Add user completes!')
    });
  }

  updateList(newItem){
    if (this.selections.includes(newItem)){
      this.selections.splice(newItem);
    }
    else{
      this.selections.push(newItem);
    }
  }

}
