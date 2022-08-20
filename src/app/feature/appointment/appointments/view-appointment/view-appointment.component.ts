import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from 'src/app/core/model/appointment';
import { AppointmentService } from 'src/app/core/service/appointment.service';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.css']
})
export class ViewAppointmentComponent implements OnInit {

  appointMent: Appointment = new Appointment();

  constructor(
    public dialogRef: MatDialogRef<ViewAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public mainService: AppointmentService
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.appointMent) {
      this.appointMent = this.data.appointMent;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
