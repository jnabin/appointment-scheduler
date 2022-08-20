import { Time } from "@angular/common";

export class Appointment {
    id: number = Date.now();
    firstName?:string;
    lastName?:string;
    email?:string;
    gender?:string;
    age?:number;
    date?:string;
    time?:string

    updateObj(data: any) {
      this.id = Date.now();
      this.firstName = data.value.firstName;
      this.lastName = data.value.lastName;
      this.email = data.value.email;
      this.gender = data.value.gender;
      this.age = data.value.age;
      this.date = data.value.date;
      this.time = data.value.time;
    }
}
  