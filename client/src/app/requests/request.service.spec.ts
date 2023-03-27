import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Request } from './request';
import { RequestService } from './request.service';

describe('RequestService', () => {
  //small collection of test Requests
  const testSel = new Map<string, boolean>([
    ['bread', false],
    ['toothpaste', true],
    ['mealworms', false]
  ]);
  const testRequests: Request[] = [
    {
      _id: '1',
      selections: testSel
    },
    {
      _id: '2',
      selections: testSel
    },
    {
      _id: '3',
      selections: testSel
    }
  ];

  let requestService: RequestService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    requestService = TestBed.inject(RequestService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('When getRequests() is called with no parameters', () => {
    it('calls `api/requests`', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));

      requestService.getRequests().subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.requestUrl, { params: new HttpParams() });
      });
    });
  });


  describe('filterRequests', ()=> {
    it('returns the correct array of requests', ()=>{
      expect(requestService.filterRequests(testRequests) === testRequests);
    });
  });

  describe('addRequest', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const REQUEST_ID = '2';
      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(REQUEST_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.addRequest(testRequests[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.newRequestUrl, testRequests[1]);
      });
  }));
});
});
