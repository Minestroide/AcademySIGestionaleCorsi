import { Component } from '@angular/core';
import {CourseComponent} from "../course/course.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CourseComponent,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './passwordreset.component.html',
  styleUrl: './passwordreset.component.scss'
})
export class PasswordresetComponent {

  email = new FormControl('');

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.email.value);
  }

}
