import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import {Route, Router, RouterLink, RouterOutlet} from '@angular/router';
import {IUser, UserService} from "./user.service";
import {NgIf} from "@angular/common";
import {CourseService} from "./course.service";
import {CoursePostService} from "./coursepost.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  providers: [UserService, CourseService, CoursePostService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'gestionalecorsi';
  @Output() loggedInUser: IUser | undefined = undefined;
  private userService: UserService;
  private courseService: CourseService;
  private coursePostService: CoursePostService;
  private router: Router;

  constructor(userService: UserService, courseService: CourseService, router: Router, coursePostService: CoursePostService) {
    this.userService = userService;
    this.courseService = courseService;
    this.coursePostService = coursePostService;

    this.router = router;

    this.loginHandler = this.loginHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  loginHandler() {
    console.info("Logged in.");
    this.courseService.clearCache();
    this.userService.clearCache();
    this.coursePostService.clearCache();
    this.courseService.refreshToken();
    this.userService.refreshToken();
    this.coursePostService.refreshToken();
    this.userService.getUsersMe().subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  logoutHandler() {
    console.info("Logged out.");
    this.courseService.clearCache();
    this.userService.clearCache();
    this.coursePostService.clearCache();
    this.courseService.refreshToken();
    this.userService.refreshToken();
    this.coursePostService.refreshToken();

    this.router.navigateByUrl("/");
  }

  ngOnInit() {

    window.addEventListener("login", this.loginHandler);
    window.addEventListener("logout", this.logoutHandler);

    this.loginHandler();
  }

  ngOnDestroy() {
    window.removeEventListener("login", this.loginHandler);
    window.removeEventListener("logout", this.logoutHandler);
  }

  logout($event: MouseEvent) {
    window.localStorage.removeItem('token');
    this.loggedInUser = undefined;
    window.dispatchEvent(new CustomEvent("logout"));
  }
}
