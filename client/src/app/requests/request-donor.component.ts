import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { RequestService } from './request.service';


@Component({
  selector: 'app-request-donor',
  templateUrl: './request-donor.component.html',
  styleUrls: ['./request-donor.component.scss'],
  providers: []
})

export class RequestDonorComponent  {
  constructor() {
  }

}
