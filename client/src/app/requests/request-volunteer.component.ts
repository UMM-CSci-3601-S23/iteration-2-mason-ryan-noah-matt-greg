import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Request } from './request';
import { RequestService } from './request.service';


@Component({
  selector: 'app-request-volunteer',
  templateUrl: './request-volunteer.component.html',
  styleUrls: ['./request-volunteer.component.scss'],
  providers: []
})

export class RequestVolunteerComponent implements OnInit, OnDestroy {
  public serverFilteredRequests: Request[];
  public filteredRequests: Request[];

  public requestDescription: string;

  private ngUnsubscribe = new Subject<void>();

  constructor(private requestService: RequestService, private snackBar: MatSnackBar) {
  }
  //Gets the requests from the server with the correct filters
  getRequestsFromServer(): void {
    this.requestService.getRequests({
    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedRequests) => {
        this.serverFilteredRequests = returnedRequests;
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
          {duration: 5000});
      },
    });
  }
  //
  public updateFilter(): void {
    this.filteredRequests = this.serverFilteredRequests;
  }
  ngOnInit(): void {
      this.getRequestsFromServer();
  }

  ngOnDestroy(): void {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
  }
}
