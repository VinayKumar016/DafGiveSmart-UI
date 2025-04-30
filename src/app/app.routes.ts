import { provideRouter, Route, Routes } from '@angular/router';
import { RegisterDafComponent } from './register-daf/register-daf.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { AddDonationComponent } from './add-donation/add-donation.component';
import { ViewDonationComponent } from './viewdonation/viewdonation.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register-daf', component: RegisterDafComponent, canActivate: [GuestGuard] },
  { path: 'home', component: HomepageComponent },
  { path: 'add-donation', component: AddDonationComponent },
  {path:'view-donation',component:ViewDonationComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

export const appRouter = provideRouter(routes);