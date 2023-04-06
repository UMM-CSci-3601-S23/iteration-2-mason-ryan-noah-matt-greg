import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockItemService } from '../../testing/item.service.mock';
import { Item } from './item';
import { InventoryCardComponent } from './inventory-card.component';
import { InventoryComponent } from './inventory.component';
import { ItemService } from './item.service';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('InventoryComponent', () => {
  let inventory: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;

  beforeEach(() => {
    TestBed.overrideProvider(ItemService, { useValue: new MockItemService() });
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [InventoryComponent, InventoryCardComponent],
      providers: [{ provide: ItemService, useValue: new MockItemService() }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(InventoryComponent);
      inventory = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  describe('The getItemsFromServer method', ()=>{
    it('contains all the items', () => {
      expect(inventory.serverFilteredItems.length).toBe(3);
    });

    it('contains an item called "banana"', () => {
      expect(inventory.serverFilteredItems.some((item: Item) => item.itemName === 'banana')).toBe(true);
    });

    it('contains an item called "soup"', () => {
      expect(inventory.serverFilteredItems.some((item: Item) => item.itemName === 'soup')).toBe(true);
    });

    it('contains an item called "eggs"', () => {
      expect(inventory.serverFilteredItems.some((item: Item) => item.itemName === 'eggs')).toBe(true);
    });

    it('doesn\'t contain a todo whose owner is  "Santa"', () => {
      expect(inventory.serverFilteredItems.some((item: Item) => item.itemName === 'Santa')).toBe(false);
    });

  });

});



