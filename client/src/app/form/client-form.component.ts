// import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClientFormService } from './client-form.service';

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

  addTodoValidationMessages = {
    name: [
      {type: 'required', message: 'Name is required'},
      {type: 'minlength', message: 'Name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Name cannot be more than 50 characters long'},
    ],
  };

  constructor(private formBuilder: FormBuilder, private fb: UntypedFormBuilder,
   private requestFormService: ClientFormService, private snackBar: MatSnackBar, private router: Router){}

  createForms() {

    // add form validations
    this.addRequestForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      name: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ])),
    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
  }

}
