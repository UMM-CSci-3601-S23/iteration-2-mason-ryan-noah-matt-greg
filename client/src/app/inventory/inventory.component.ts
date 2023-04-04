import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from './item';
import { ItemService } from './item.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  public serverFilteredItems: Item[]; //doesnt do anything
  public filteredItems: Item[];

  // public itemID: string;
  // public itemName: string;
  // public itemUnit: string;
  // public itemAmount: string;

  // public itemService: ItemService;

  private ngUnsubscribe = new Subject<void>();


  constructor(private itemService: ItemService, private snackBar: MatSnackBar) {
  }

  getItemsFromServer(): void {
    this.itemService.getItems({
    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedItems) => {
        this.serverFilteredItems = returnedItems;
      },

      error: (err) => {
        let message = '';
        if (err.error instanceof ErrorEvent) {
          message = `Problem in the client – Error: {err.error.message}`;
        } else {
          message = `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`;
        }
        this.snackBar.open(
          message,
          'OK',
          { duration: 5000 });
      },
    });
  }


  ngOnInit(): void {
    this.getItemsFromServer();
    console.log(this.serverFilteredItems);
  }
}
