import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Item } from '../app/inventory/item';
import { ItemService } from '../app/inventory/item.service';

/**
 * A "mock" version of the `TodoService` that can be used to test components
 * without having to create an actual service. It needs to be `Injectable` since
 * that's how services are typically provided to components.
 */
@Injectable()
export class MockItemService extends ItemService {
  static testItems: Item[] = [
    {
      _id: 'banana_id',
      itemName: 'banana',
      unit: 'bundle',
      amount: '12',
    },
    {
      _id: 'soup_id',
      itemName: 'soup',
      unit: 'cans',
      amount: '5',
    },
    {
      _id: 'eggs_id',
      itemName: 'eggs',
      unit: 'carton',
      amount: '4',
    }
  ];

  constructor() {
    super(null);
  }

  getForms(): Observable<Item[]> {
    return of(MockItemService.testItems);
}
}
