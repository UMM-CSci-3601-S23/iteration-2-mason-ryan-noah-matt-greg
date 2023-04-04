import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from './item';
import { ItemService } from './item.service';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit{
  public serverFilteredItems: Item[]; //doesnt do anything
  public filteredItems: Item[];

  public itemID: string;
  public itemName: string;
  public itemUnit: string;
  public itemAmount: string;

  public itemService: ItemService;

  constructor( private snackBar: MatSnackBar) {
  }

  getItemsFromServer() {
    this.itemService.getItems({
      itemName: this.itemName,
      unit: this.itemUnit,
      amount: this.itemAmount,
    }).subscribe(returnedItems => {
      this.serverFilteredItems = returnedItems;
      this.updateFilter();
    }, err => {
      console.error('We couldn\'t get the list of todos; the server might be down :(');
      this.snackBar.open(
        'Problem contacting server – try again',
        'OK',
        { duration: 3000 });
    });
  }

  public updateFilter() {
  }

  ngOnInit(): void {
    //this.getItemsFromServer();
  }
}

