import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd  } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'PocketShelf';
  currentRoute: string;

  constructor(private router: Router){
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd && event.url) {
        this.currentRoute = event.url;
      }
    });
  }

}
