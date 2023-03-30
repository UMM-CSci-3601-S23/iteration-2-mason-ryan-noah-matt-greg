// import {Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup,  } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientFormService } from './client-form.service';
import { RequestService } from '../requests/request.service';


/** @title Checkboxes with reactive forms */
@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})

export class ClientFormComponent implements OnInit {
  foods = this.formBuilder.group({
    miscFreshFruit: false, appleJuice: false, frozenPeaches: false, mixedFruit: false, peaches: false,
    appleSauce: false, dates: false, carrots: false, miscFreshVegetables: false, corn: false,
    greenBeans: false, peas: false, sweetPotatoes: false, spinach: false, cannedCarrots: false,
    dicedTomatoes: false, spaghettiSauce: false, groundBeef: false, groundBeefOrPorkBlend: false, plantBasedBurgers: false,
    pizzaRanchPizza: false, veggieRavioli: false, chickenDrumsticks: false, wholeChicken: false, chickenBreast: false,
    chickenLegQtrs: false, fishSticks: false, ham: false, assortedMeats: false, chicken: false,
    tuna: false, salmon: false, pastaWithMeatSauce: false, pastaInButterSauce: false, cannedChili: false,
    vegCurry: false, hotDogSauce: false, blackEyedPeas: false, yellowEyedBeans: false, pintoBeans: false,
    porkAndBeans: false, refriedBeans: false, whiteBeans: false, blackBeans: false, driedPintoBeans: false,
    yellowSplitPeas: false, kidneyBeans: false, miscDriedBeans: false, peanutButter: false, almonds: false,
    walnuts: false, crackers: false, cookies: false, miscSnacks: false, rice: false,
    stuffingMix: false, pancakeMix: false, quickOats: false, readyToEatCereal: false, elbowNoodles: false,
    macaroniAndCheese: false, pennePasta: false, instantPastaOrRice: false, bread: false, hamburgerBuns: false,
    hotDogBuns: false, bakedGoods: false, freshMilk: false, miscellaneousDairyProducts: false, cheese: false,
    yogurt: false, butter: false, shelfStableMilk: false, bakingMix: false, cakeMix: false,
    flour: false, muffinMix: false, cookieMix: false, miscellaneousBakingItems: false, vegetableOil: false,
    chickenNoodleSoup: false, tomatoSoup: false, vegetableSoup: false, creamyCannedSoup: false, miscellaneousSoup: false,
    seasonings: false, hotSauce: false, saladDressing: false, ranchDressing: false, mustard: false,
    syrup: false, miscellaneousPicklesOlivesETC: false, fruitOrVegetablePuree: false, babyCereal: false, formula: false,
    newbornGiftBag: false, diapers: false, shampoo: false, bodyOrHandSoap: false, toothpaste: false,
    toothbrushes: false, birthdayPartyKit: false, handSanitizer: false, feminineHygiene: false, dishSoap: false,
    laundryDetergent: false, disinfectingWipes: false,
  });

  addRequestForm: UntypedFormGroup;
  firstFormGroup: FormGroup = this.formBuilder.group({firstCtrl: ['']});
  secondFormGroup: FormGroup = this.formBuilder.group({secondCtrl: ['']});
  isLinear = false;

  newRequestValidationMessages = {
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
   private requestFormService: ClientFormService, private snackBar: MatSnackBar, private router: Router,
   private requestService: RequestService){}

  createForms() {

    // add todo form validations
    this.addRequestForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      name: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ])),
    });

  }

  formControlHasError(controlName: string): boolean {
    return this.addRequestForm.get(controlName).invalid &&
      (this.addRequestForm.get(controlName).dirty || this.addRequestForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.newRequestValidationMessages): string {
    for(const {type, message} of this.newRequestValidationMessages[name]) {
      if (this.addRequestForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  // validateHousehold1() {

  // }


  // validateHousehold2() {
  //   if (typeof this !== "number") {
  //     return {
  //       ok: false,
  //       message: 'please enter a number'
  //     };
  //   } else if (this < 1) {
  //     return {
  //       ok: false,
  //       message: 'please enter a number greater than 0'
  //     };
  //   } else if (this > 21) {
  //     return {
  //       ok: false,
  //       message: 'please enter a number less than 21'
  //     };
  //   }
  // }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.requestService.addRequest(this.addRequestForm.value).subscribe({
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
