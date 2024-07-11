import { Component } from '@angular/core';
import {CourseComponent} from "../course/course.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../services/user.service";
import {catchError} from "rxjs";

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

  private router: Router;

  private userService: UserService;

  constructor(userService: UserService, router: Router) {
    this.userService = userService;
    this.router = router;
  }



  onSubmit(event: SubmitEvent) {
    event.preventDefault();

    if(!this.name.value || !this.surname.value || !this.email.value || !this.username.value
    ) {
      alert("All fields are required.");
      return;
    }

    this.userService.register(this.username.value, this.email.value, this.name.value, this.surname.value).pipe(catchError(() => {
      alert("An error occurred.");
      return [];
    })).subscribe((resp) => {
      alert("Registration successful. An email with the password has been sent to the specified email address.");
      this.router.navigateByUrl("/login");
    });

  }

}
