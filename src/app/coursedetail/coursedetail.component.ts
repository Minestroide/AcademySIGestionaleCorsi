import {Component, effect, Input, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {CourseService, ICourse} from "../course.service";
import {IUser, UserService} from "../user.service";
import {ActivatedRoute, Route, Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-coursedetail',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './coursedetail.component.html',
  styleUrl: './coursedetail.component.scss'
})
export class CoursedetailComponent implements OnInit {

  public course: ICourse | undefined;
  public user: WritableSignal<IUser | undefined> = signal(undefined);
  private userService: UserService;
  public authorized: boolean = false;
  private courseService: CourseService;
  public error: string | undefined = undefined;
  private activatedRoute: ActivatedRoute;

  constructor(courseService: CourseService, activatedRoute: ActivatedRoute, userService: UserService) {
    this.courseService = courseService;
    this.activatedRoute = activatedRoute;
    this.userService = userService;

    effect(() => {
      if(this.user()) {
        this.authorized = true;

        this.activatedRoute.params.subscribe((params) => {
          let courseId = params['id'];
          if(!courseId) {
            this.error = "No course ID provided.";
            return;
          }

          this.courseService.getCourse(courseId).subscribe((course) => {
            this.course = course;
          });
        });
      }
    });
  }

  ngOnInit(): void {

    this.userService.getUsersMe().subscribe((user) => {
      this.user.set(user);
    });

  }

}
