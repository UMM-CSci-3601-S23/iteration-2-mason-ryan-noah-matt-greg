import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FoodType } from '../request';
import { ItemType } from '../request';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent {

  public type: ItemType = 'food';

  newRequestForm = new FormGroup({
    // We want descriptions to be short and sweet, yet still required so we have at least some idea what
    // the client wants
    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
    ])),

    itemType: new FormControl<ItemType>('food',Validators.compose([
      Validators.required,
      Validators.pattern('^(food|toiletries|other)$'),
    ])),

    foodType: new FormControl<FoodType>('',Validators.compose([
      Validators.pattern('^(dairy|grain|meat|fruit|vegetable|)$'),
    ])),
  });

  readonly newRequestValidationMessages = {
    description: [
      {type: 'required', message: 'Description is required'},
      {type: 'minlength', message: 'Description must be at least 5 characters long'},
      {type: 'maxlength', message: 'Description cannot be more than 200 characters long'},
    ],
    itemType: [
      { type: 'required', message: 'Item type is required' },
      { type: 'pattern', message: 'Item type must be food, toiletries, or other' },
    ],
    foodType: [
      {type: 'pattern', message: 'Food type must be one of dairy, grain, meat, fruit, or vegetable'},
    ]
  };

  constructor(private requestService: RequestService, private snackBar: MatSnackBar, private router: Router) {
  }

  formControlHasError(controlName: string): boolean {
    return this.newRequestForm.get(controlName).invalid &&
      (this.newRequestForm.get(controlName).dirty || this.newRequestForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.newRequestValidationMessages): string {
    for(const {type, message} of this.newRequestValidationMessages[name]) {
      if (this.newRequestForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    this.requestService.addRequest(this.newRequestForm.value).subscribe({
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
}
