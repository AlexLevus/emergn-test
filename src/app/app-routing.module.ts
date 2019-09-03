import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from "./login-page/login-page.component";
import {DashboardPageComponent} from "./dashboard-page/dashboard-page.component";
import {AuthGuard} from "./services/auth.guard";
import {UserFormComponent} from "./user-form/user-form.component";
import {EditFormComponent} from "./edit-form/edit-form.component";


const routes: Routes = [
  {
    path:'', component: DashboardPageComponent, canActivate: [AuthGuard], children: [
      {path:'edit/:id', component: EditFormComponent}
      ]
  },
  {path:'login', component: LoginPageComponent, children: [
      {path:'registration', component: UserFormComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
