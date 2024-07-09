import { Component } from '@angular/core';
import {CourseComponent} from "../course/course.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CourseComponent,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  name = new FormControl('');
  surname = new FormControl('');
  email = new FormControl('');
  username = new FormControl('');
  password = new FormControl('');

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.name.value, this.surname.value, this.email.value, this.username.value, this.password.value);
  }

}
