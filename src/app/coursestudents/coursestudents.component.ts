import {Component, effect, OnInit, signal, WritableSignal} from '@angular/core';
import {CourseService, ICourse} from "../services/course.service";
import {CoursePostService, ICoursePost} from "../services/coursepost.service";
import {IUser, UserService} from "../services/user.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormControl} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-coursestudents',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgForOf
  ],
  templateUrl: './coursestudents.component.html',
  styleUrl: './coursestudents.component.css'
})
export class CoursestudentsComponent implements OnInit {

  public course: ICourse | undefined;
  public userCache: {[key: string]: IUser} = {};
  public user: WritableSignal<IUser | undefined> = signal(undefined);
  public update: WritableSignal<number> = signal(0);
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

            this.course.userIds.forEach((userId) => {
              this.userService.getUser(userId).subscribe((user) => {
                this.userCache[userId] = user;
              });
            });
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
