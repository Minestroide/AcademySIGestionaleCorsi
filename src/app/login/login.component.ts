import { Component } from '@angular/core';
import {CourseComponent} from "../course/course.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import axios from "axios";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CourseComponent,
    NgForOf,
    NgIf,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = new FormControl('');
  password = new FormControl('');
  error: string | undefined = undefined;

  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.username.value, this.password.value);

    axios.post('http://localhost:8080/api/auth/login', {
      email: this.username.value,
      password: this.password.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((resp) => {
      console.log(resp.data);
      window.localStorage.setItem('token', resp.data.token);
      window.dispatchEvent(new CustomEvent("login"));
      this.router.navigateByUrl("/courses");
    }).catch((err) => {
      let statusCode = err.response.status;
      if(statusCode === 401) {
        this.error = "Invalid credentials.";
      } else {
        this.error = "An error occurred.";
      }
    })
  }

}
