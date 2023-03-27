import {Component} from '@angular/core';

@Component({
  selector: 'app-home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: []
})
export class HomeComponent {
  public userRole: 'client' | 'donor' | 'volunteer' | 'clientform';

  changeRole(newRole: HomeComponent['userRole']){
    this.userRole = newRole;
  }

}

