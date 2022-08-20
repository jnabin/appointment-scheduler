import { Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarView,
} from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { CreateAppointmentDialogComponent } from './create-appointment-dialog/create-appointment-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from 'src/app/core/service/appointment.service';
import { Appointment } from 'src/app/core/model/appointment';
import { ViewAppointmentComponent } from './view-appointment/view-appointment.component';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit, OnDestroy {

  @Input() set currentView(value: any) {
    this._currentView = value;
  }

  _currentView: any
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  actions: CalendarEventAction[] = [];
  subscription: any;
  appointments: Appointment[] = [];
  events: CalendarEvent[] = [];
  activeDayIsOpen = true;
  currentMonth = this.viewDate.getMonth();
  months = [
    {id: 0, name: 'January'},
    {id: 1, name: 'February'},
    {id: 2, name: 'March'},
    {id: 3, name: 'April'},
    {id: 4, name: 'May'},
    {id: 5, name: 'June'},
    {id: 6, name: 'July'},
    {id: 7, name: 'August'},
    {id: 8, name: 'September'},
    {id: 9, name: 'Actobor'},
    {id: 10, name: 'November'},
    {id: 11, name: 'December'},
  ]

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private mainService: AppointmentService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    this.subscription = this.mainService.allAppointmentList.subscribe(appointmentList => {
      if (appointmentList) {
        this.appointments = appointmentList;
        this.updateCalenderEvents();
      } 
    });

    this.route.params.subscribe((params) => {
      let month = params["month"];
      if(month >= 1 && month <= 12) {
        this.viewDate.setMonth(month-1);
        this.currentMonth = month - 1;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  updateViewDate(){
    this.viewDate.setMonth(this.currentMonth);
    this.closeOpenMonthViewDay();
  }

  updateCalenderEvents() {
    this.events = [];
    this.appointments.forEach(x => {
      this.events.push(
        {
          id: x.id,
          start: new Date(x.date || ''),
          end: new Date(x.date || ''),
          title: `${x.firstName} ${x.lastName}`,
          color: colors.red,
          actions: this.actions,
          allDay: true,
          draggable: false,
        }
      );
    });
  }

  get count() {
    return this.events.filter(x => x.start.getMonth() == this.viewDate.getMonth()).length;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateAppointmentDialogComponent, {
      width: '450px',
      data: {name: '', animal: ''},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  viewAppointment(id: number) {
    let ap = this.appointments.find(x => x.id == id);

    const dialogRef = this.dialog.open(ViewAppointmentComponent, {
      width: '450px',
      data: {appointMent: ap},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.updateCalenderEvents();
  }

}
