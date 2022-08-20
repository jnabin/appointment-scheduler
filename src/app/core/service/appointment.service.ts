import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Appointment } from '../model/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentForm: FormGroup;

  private appointments: Appointment[] = [];
  private _appointmentList = new BehaviorSubject<Appointment[]>(this.appointments);
  private _appointmentList$ = this._appointmentList.asObservable();

  constructor(private fb: FormBuilder) { 
    this.appointmentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(40)]],
      lastName: ['', [Validators.required, Validators.maxLength(40)]],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      age: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      date: [''],
      time: [''],
    });

    let data = []
    if(localStorage.getItem('appoontments') != null) {
      data = JSON.parse(localStorage.getItem('appoontments') || ''); 
    }

    this.appointments = data;
    this._appointmentList = new BehaviorSubject<Appointment[]>(this.appointments);
    this._appointmentList$ = this._appointmentList.asObservable();
  }

  get allAppointmentList(): Observable<Appointment[]> {
    return this._appointmentList$;
  }

  setAppointment(item: Appointment) {
    item.id = Date.now();   
    this.appointments = [];
    this.updateLocalStorage(item);
    this._appointmentList.next(this.appointments);
  }

  updateLocalStorage(item: any) {
    let data = []
    if (localStorage.getItem('appoontments') != null) {
      data.push(...(JSON.parse(localStorage.getItem('appoontments') || ''))); 
    } 
    data.push(item);
    localStorage.removeItem('appoontments');
    localStorage.setItem('appoontments', JSON.stringify(data));
    this.appointments = data;
  }

  public get form() {
    return this.appointmentForm;
  }

  public get firstName() {
    return this.appointmentForm.get('firstName');
  }

  public get lastName() {
      return this.appointmentForm.get('lastName');
  }

  public get email() {
      return this.appointmentForm.get('email');
  }

  public get gender() {
      return this.appointmentForm.get('gender');
  }

  public get age() {
      return this.appointmentForm.get('age');
  }

  public get date() {
      return this.appointmentForm.get('date');
  }

  public get time() {
      return this.appointmentForm.get('time');
  }
}
