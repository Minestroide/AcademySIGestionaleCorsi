import {Component, effect, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {CourseService, ICourse} from "../services/course.service";
import {RouterLink} from "@angular/router";
import {IUser, UserService} from "../services/user.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  styleUrl: './course.component.scss'
})
export class CourseComponent implements OnInit {

  @Input() public course: ICourse | undefined;

  private userService: UserService;
  private courseService: CourseService;

  public user: WritableSignal<IUser | undefined> = signal(undefined);

  public update: WritableSignal<number> = signal(0);

  public subscribed: boolean = false;

  constructor(userService: UserService, courseService: CourseService) {
    this.userService = userService;
    this.courseService = courseService;

    effect(() => {
      this.update();
      if(!this.user()) {
        this.subscribed = false;
      } else {
        if(!this.course) return;
        console.info(this.course.userIds, this.user()!.id);
        this.subscribed = this.course?.userIds.includes(this.user()!.id);
      }
    });
  }

  ngOnInit() {
    this.user.set(undefined);

    this.userService.getUsersMe().subscribe((user) => {
      this.user.set(user);
    });
  }

  subscribeToCourse(event: MouseEvent) {
    event.preventDefault();
    if(!this.course || !this.user()) return;
    this.courseService.subscribeToCourse(this.course.id).subscribe(() => {
      this.courseService.clearCache();
      this.subscribed = true;
    });
  }
}
