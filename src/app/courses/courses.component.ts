import {Component, effect, Input, OnChanges, OnInit, signal, SimpleChanges, WritableSignal} from '@angular/core';
import axios from "axios";
import {CourseService, ICourse} from "../course.service";
import {CourseComponent} from "../course/course.component";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {IUser, UserService} from "../user.service";

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CourseComponent,
    NgForOf,
    NgIf,
    RouterLink,
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {

  private courseService: CourseService;
  private userService: UserService;

  constructor(coursesService: CourseService, userService: UserService) {
    this.courseService = coursesService;
    this.userService = userService;

    effect(() => {
      if(this.user()) {
        this.courseService.getMyCourses().subscribe((courses) => {
          this.myCourses = courses;
          this.loading = false;
        });
      }
    });
  }

  public courses: ICourse[] = [];
  public myCourses: ICourse[] = [];
  public loading: boolean = true;
  public user: WritableSignal<IUser | undefined> = signal(undefined);

  ngOnInit() {
    console.info("Setting user to undefined.")
    this.user.set(undefined);

    this.userService.getUsersMe().subscribe((user) => {
      this.user.set(user);
    });

    this.courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
      this.loading = false;
    });
  }

}
