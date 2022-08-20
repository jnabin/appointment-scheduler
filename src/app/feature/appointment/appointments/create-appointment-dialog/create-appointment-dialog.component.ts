import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from 'src/app/core/model/appointment';
import { AppointmentService } from 'src/app/core/service/appointment.service';

@Component({
  selector: 'app-create-appointment-dialog',
  templateUrl: './create-appointment-dialog.component.html',
  styleUrls: ['./create-appointment-dialog.component.css']
})
export class CreateAppointmentDialogComponent implements OnInit {
  appointmentForm: FormGroup;
  
  constructor(
    public dialogRef: MatDialogRef<CreateAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public mainService: AppointmentService
  ) { 
    this.appointmentForm = this.mainService.form;
  }

  ngOnInit(): void {
    this.appointmentForm.reset();
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.mainService.setAppointment(this.appointmentForm.value);
      this.onNoClick();
    } else {
      this.validateAllFormFields(this.appointmentForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {            
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {       
        this.validateAllFormFields(control);           
      }
    });
  }

}
