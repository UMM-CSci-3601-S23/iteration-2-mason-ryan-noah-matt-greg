import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientFormComponent } from './form/form-client.component';
import { HomeComponent } from './home/home.component';
import { InventoryComponent } from './inventory/inventory.component';
import { RequestDonorComponent } from './requests/request-donor.component';
import { NewItemComponent } from './inventory/new-item/new-item.component';
import { FormVolunteerComponent } from './form/form-volunteer.component';



// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Home'},
  {path: 'requests/donor', component: RequestDonorComponent, title: 'Donor View'},
  {path: 'requests/volunteer', component: FormVolunteerComponent, title: 'Volunteer View'},
  {path: 'requests/client', component: ClientFormComponent, title: 'Client View'},
  {path: 'requests/donor', component: RequestDonorComponent, title: 'Donor View'},
  {path: 'requests/clientform', component: ClientFormComponent, title: 'Client Form'},
  {path: 'inventory/volunteer', component: InventoryComponent, title: 'Inventory'},
  {path: 'inventory/new', component: NewItemComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
