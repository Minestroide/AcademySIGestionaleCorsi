import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import {Route, Router, RouterLink, RouterOutlet} from '@angular/router';
import {IUser, UserService} from "./services/user.service";
import {NgIf} from "@angular/common";
import {CourseService} from "./services/course.service";
import {CoursePostService} from "./services/coursepost.service";
import {CategoryService} from "./services/category.service";
import {CourseTaskService} from "./services/coursetask.service";
import {ContactService} from "./services/contact.service";
import {RoleService} from "./services/role.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  providers: [UserService, CourseService, CoursePostService, CategoryService, CourseTaskService, ContactService, RoleService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'gestionalecorsi';
  @Output() loggedInUser: IUser | undefined = undefined;
  public isAdmin: boolean = false;
  private userService: UserService;
  private courseService: CourseService;
  private coursePostService: CoursePostService;
  private contactService: ContactService;
  private roleService: RoleService;
  private router: Router;

  constructor(userService: UserService, courseService: CourseService, router: Router, coursePostService: CoursePostService, roleService: RoleService, contactService: ContactService) {
    this.userService = userService;
    this.courseService = courseService;
    this.coursePostService = coursePostService;
    this.roleService = roleService;
    this.contactService = contactService;

    this.router = router;

    this.loginHandler = this.loginHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  loginHandler() {
    console.info("Logged in.");
    this.courseService.clearCache();
    this.userService.clearCache();
    this.coursePostService.clearCache();
    this.contactService.clearCache();
    this.courseService.refreshToken();
    this.userService.refreshToken();
    this.coursePostService.refreshToken();
    this.contactService.refreshToken();
    this.userService.getUsersMe().subscribe((user) => {
      this.loggedInUser = user;

      this.roleService.getRoles().subscribe((roles) => {
        console.info(roles);
        this.isAdmin = roles.some((role) => role.type === "ADMIN");
      });
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
    this.contactService.clearCache();
    this.contactService.refreshToken();

    this.router.navigateByUrl("/");
    this.isAdmin = false;
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
