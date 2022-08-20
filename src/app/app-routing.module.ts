import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'month',loadChildren:()=>import('./feature/appointment/appointment.module').then(mod=>mod.AppointmentModule)},
  {path:'',redirectTo:'month', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
