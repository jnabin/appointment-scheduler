import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { SharedModule } from './shared/shared.module';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


@NgModule({
  declarations: [
    AppointmentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
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
