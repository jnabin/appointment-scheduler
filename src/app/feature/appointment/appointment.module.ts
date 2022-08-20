import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { SharedModule } from './shared/shared.module';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MaterialModule } from 'src/app/design/material/material.module';
import { CreateAppointmentDialogComponent } from './appointments/create-appointment-dialog/create-appointment-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewAppointmentComponent } from './appointments/view-appointment/view-appointment.component';


@NgModule({
  declarations: [
    AppointmentsComponent,
    CreateAppointmentDialogComponent,
    ViewAppointmentComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    SharedModule,
    MaterialModule,
    AppointmentRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ]
})
export class AppointmentModule { 
  static forRoot(): ModuleWithProviders<CalendarModule> {
    return {
      ngModule: CalendarModule,
      providers: [
        {
          provide: DateAdapter,
          useFactory: adapterFactory,
        }
      ]
    };
  }
}
