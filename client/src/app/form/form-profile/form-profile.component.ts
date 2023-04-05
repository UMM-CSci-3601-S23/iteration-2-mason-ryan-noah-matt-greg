import { Component, OnInit } from '@angular/core';
import { Form } from '../form';
import { RequestService } from 'src/app/requests/request.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-form-profile',
  templateUrl: './form-profile.component.html',
  styleUrls: ['./form-profile.component.scss']
})
export class FormProfileComponent implements OnInit{

  form: Form;
  id: string;

  constructor(private route: ActivatedRoute, private requestService: RequestService){}

  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested request.
    this.route.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id');
      this.requestService.getRequestById(this.id).subscribe(request => this.form = request);
    });
  }
}
