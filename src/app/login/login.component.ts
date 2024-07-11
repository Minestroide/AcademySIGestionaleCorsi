import { Component } from '@angular/core';
import {CourseComponent} from "../course/course.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import axios from "axios";
import { Router } from '@angular/router';
import {UserService} from "../services/user.service";
import {catchError} from "rxjs";

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

  private userService: UserService;

  username = new FormControl('');
  password = new FormControl('');
  enableTwoFactorField: boolean = false;
  error: string | undefined = undefined;

  private router: Router;
  twoFactorCode: FormControl = new FormControl('');

  constructor(router: Router, userService: UserService) {
    this.router = router;
    this.userService = userService;
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();

    if(!this.username.value || !this.password.value) {
      alert("All fields are required.");
      return;
    }
    console.log(this.username.value, this.password.value);

    this.userService.login(this.username.value, this.password.value, this.twoFactorCode?.value).subscribe((resp) => {
      window.localStorage.setItem('token', resp.token);
      window.dispatchEvent(new CustomEvent("login"));
      this.router.navigateByUrl("/courses");
    }, (err) => {
      let error: any = err?.error;
      let errorType: string = error?.type;
      if(errorType == "TWO_FACTOR_CODE_NEEDED") {
        this.enableTwoFactorField = true;
      } else {
        this.error = "Invalid credentials";
      }
    });
  }

}
