import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Form } from './form';
import { FormService } from './form.service';

describe('FormService', () => {
  //small collection of test Forms
    const testForms: Form[] = [
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

  let formService: FormService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    formService = TestBed.inject(FormService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('When getForms() is called with no parameters', () => {
    it('calls `api/forms`', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testForms));

      formService.getForms().subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(formService.formUrl, { params: new HttpParams() });
      });
    });
  });

  describe('When getForms() is called with sortOrder newest', () => {
    //test food top level category
    it('correctly calls api/forms with itemType \'food\'', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testForms));

      //getting forms with top category food
      formService.getForms({sortOrder: 'newest'}).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(formService.formUrl, { params: new HttpParams().set('sortOrder', 'newest')});
      });
    });
  });


  describe('addForm', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP form,
      // it just returns our test data.
      const REQUEST_ID = '2';
      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(REQUEST_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      formService.addForm(testForms[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(formService.newFormUrl, testForms[1]);
      });
    }));
  });
});
