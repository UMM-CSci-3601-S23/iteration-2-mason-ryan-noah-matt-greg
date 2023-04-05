import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Form } from 'src/app/form/form';
import { FormService } from 'src/app/form/form.service';

@Injectable({
  providedIn: AppComponent
})
export class MockFormService extends FormService {
  static testForms: Form[] = [
    {
      _id: '1_id',
      name: 'Chris Pine',
      selections: [
        'miscSnacks',
        'bread',
        'greenBeans'
      ],
      timeSubmitted: '20180604'
    },
    {
      _id: '2_id',
      name: 'Micheal Cera',
      selections: [
        'yogurt',
        'cheese',
        'carrots'
      ],
      timeSubmitted: '20190604'
    },
    {
      _id: '3_id',
      name: 'Margot Robbie',
      selections: [
        'hotSauce',
        'bakedGoods',
        'milk'
      ],
      timeSubmitted: '20170604'
    },
    {
      _id: '4_id',
      name: 'John Cena',
      selections: [
        'tomatoSoup',
        'groundBeef',
        'corn'
      ],
      timeSubmitted: '20200604'
    }
  ];

  constructor() {
    super(null);
  }

  getForms(): Observable<Form[]> {
      return of(MockFormService.testForms);
  }


}
