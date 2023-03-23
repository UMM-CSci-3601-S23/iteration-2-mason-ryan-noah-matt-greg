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
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockRequestService } from 'src/testing/request.service.mock';
import { ItemType, Request } from './request';
import { RequestVolunteerComponent } from './request-volunteer.component';
import { RequestService } from './request.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const COMMON_IMPORTS: unknown[] = [
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
  MatIconModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('Volunteer Request View', () => {
  let volunteerList: RequestVolunteerComponent;
  let fixture: ComponentFixture<RequestVolunteerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [RequestVolunteerComponent],
      providers: [{ provide: RequestService, useValue: new MockRequestService() }]
    });
  });

  beforeEach(waitForAsync (() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RequestVolunteerComponent);
      volunteerList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all requests', () => {
    expect(volunteerList.serverFilteredRequests.length).toBe(4);
  });

  it('contains a request for food', () => {
    expect(volunteerList.serverFilteredRequests.some((request: Request) => request.itemType === 'food')).toBe(true);
  });

  it('contains a request for toiletries', () => {
    expect(volunteerList.serverFilteredRequests.some((request: Request) => request.itemType === 'toiletries')).toBe(true);
  });

  it('contains a request for other', () => {
    expect(volunteerList.serverFilteredRequests.some((request: Request) => request.itemType === 'other')).toBe(true);
  });

  it('contains a request for itemType food and foodType meat', () => {
    expect(volunteerList.serverFilteredRequests.some((request: Request) => request.itemType === 'food'
     && request.foodType === 'meat')).toBe(true);
  });
});

describe('Misbehaving Volunteer view', () => {
  let volunteerList: RequestVolunteerComponent;
  let fixture: ComponentFixture<RequestVolunteerComponent>;

  let requestServiceStub: {
    getRequests: () => Observable<Request[]>;
  };

  beforeEach(() => {
    requestServiceStub = {
      getRequests: () => new Observable(observer => {
        observer.error('getRequests() Observer generates an error');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [RequestVolunteerComponent],
      providers: [{provide: RequestService, useValue: requestServiceStub}]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RequestVolunteerComponent);
      volunteerList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a RequestVolunteerService', () => {
    expect(volunteerList.serverFilteredRequests).toBeUndefined();
  });

  it('updateFilter properly reassigns our request list', ()=>{
    volunteerList.updateFilter();
    expect(volunteerList.filteredRequests === volunteerList.serverFilteredRequests).toBeTruthy();
  });

});
