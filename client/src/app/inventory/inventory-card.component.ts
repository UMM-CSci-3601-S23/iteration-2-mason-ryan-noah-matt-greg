import { Component, Input } from '@angular/core';
import { Item } from './item';


@Component({
  selector: 'app-inventory-card',
  templateUrl: './inventory-card.component.html',
  styleUrls: ['./inventory-card.component.scss']
})
export class InventoryCardComponent {
  @Input() item: Item;
  @Input() simple?= false;

}
