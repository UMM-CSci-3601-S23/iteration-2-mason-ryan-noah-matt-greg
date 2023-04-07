import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Item } from './item';
import { ItemService } from './item.service';

describe('ItemService', () => {
  const testItems: Item[] = [
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
  let itemService: ItemService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    itemService = new ItemService(httpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getItems()', () => {

    it('calls `/api/items/get` when `getItems()` is called with no parameters', () => {
      itemService.getItems().subscribe(
        items => expect(items).toBe(testItems)
      );

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(itemService.itemUrl);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);
      // Specify the content of the response to that request. This
      // triggers the subscribe above, which leads to that check
      // actually being performed.
      req.flush(testItems);
    });
  });
});

