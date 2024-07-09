import {Component, effect, OnInit, signal, WritableSignal} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CourseService, ICourse} from "../course.service";
import {ICoursePost} from "../coursepost.service";
import {IUser, UserService} from "../user.service";

@Component({
  selector: 'app-coursetasks',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './coursetasks.component.html',
  styleUrl: './coursetasks.component.css'
})
export class CoursetasksComponent implements OnInit {

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
      console.info(this.update());
      if(this.user()) {
        console.info("User is logged in.")
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
