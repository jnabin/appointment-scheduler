import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { CreateAppointmentDialogComponent } from './create-appointment-dialog/create-appointment-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AppointmentService } from 'src/app/core/service/appointment.service';
import { Appointment } from 'src/app/core/model/appointment';

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

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;
  @Input() set currentView(value: any) {
    this._currentView = value;
    this.updateCalenderEvents();
  }
  @Output() filtered = new EventEmitter<any>();

  _currentView: any
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  sortValue = "id asc";
  filter: any[] = [
		{
			"key": "due_date",
			"op": "between",
			"value": `2022-0${this.viewDate.getMonth()+1}-01`,
			"between": `2022-0${this.viewDate.getMonth()+2}-01`
		}
	];
  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  subscription: any;
  appointments: Appointment[] = [];
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  activeDayIsOpen = true;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private mainService: AppointmentService
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
      console.log(month);
      if(month >= 1 && month <= 12) {
        this.viewDate.setMonth(month-1);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
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
    this.refresh.next();
  }

  assignAddress(item: any){
    let address = ""
    address += item['civic'] ? item['civic'] + ' ' : ''
    address += item['parcel'] ? item['parcel'] + ' ' : ''
    address += item['street'] ? item['street'] + ', ' : ''
    address += item['apartment'] ? 'apt.' + item['apartment'] + ', ' : ''

    item = Object.assign(item, {address: address.substring(0, address.length - 2)})
    return item
  }

  parsePhoneNumber(obj: { [x: string]: string; }, key: string){
    //todo
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
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


  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.updateCalenderEvents();
  }

}
