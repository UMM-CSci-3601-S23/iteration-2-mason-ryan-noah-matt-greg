import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';
@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent {


newItemForm = new FormGroup({
  // We want amounts to be short and sweet, yet still required so we have at least some idea what
  // the client wants
  amount: new FormControl('', Validators.compose([
    Validators.required,
    Validators.pattern('^(\\d*)$'),
  ])),

  itemName: new FormControl('',Validators.compose([
    Validators.required,
  ])),

  unit: new FormControl('',Validators.compose([
    Validators.required,
  ])),
});

readonly newItemValidationMessages = {
  amount: [
    {type: 'required', message: 'Amount is required'},
    {type: 'pattern', message: 'Amount must be a number'}
  ],
  itemName: [
    { type: 'required', message: 'Item name is required' },
  ],
  unit: [
    { type: 'required', message: 'Unit is required' },
  ]
};
constructor(private itemService: ItemService, private snackBar: MatSnackBar, private router: Router) {
}

formControlHasError(controlName: string): boolean {
  return this.newItemForm.get(controlName).invalid &&
    (this.newItemForm.get(controlName).dirty || this.newItemForm.get(controlName).touched);
}

getErrorMessage(name: keyof typeof this.newItemValidationMessages): string {
  for(const {type, message} of this.newItemValidationMessages[name]) {
    if (this.newItemForm.get(name).hasError(type)) {
      return message;
    }
  }
  return 'Unknown error';
}

submitForm() {
  this.itemService.addItem(this.newItemForm.value).subscribe({
    next: (newId) => {
      this.snackBar.open(
        `Item successfully submitted`,
        null,
        { duration: 2000 }
      );
      this.router.navigate(['/items']);
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
